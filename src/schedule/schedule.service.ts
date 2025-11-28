import { Injectable } from '@nestjs/common';
import { QuerylistDto } from 'src/common/dto/querylist.dto';
import { ScheduleDto } from 'src/common/dto/schedule.dto';
import { dataCleaner } from './data_cleaner';
import type {
  QueryListNew,
  ScheduleSplitDto,
} from 'src/common/type/schedule.type';
import { BigQuery } from '@google-cloud/bigquery';
import { setTimeout as wait } from 'timers/promises';
import { GoogleCredentialJson } from 'src/common/type/googleCredential.type';

@Injectable()
export class ScheduleService {
  private rawBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  private jsonString = Buffer.from(this.rawBase64, 'base64').toString('utf8');
  private json = JSON.parse(this.jsonString) as GoogleCredentialJson;

  private bigquery: BigQuery = new BigQuery({
    projectId: this.json.project_id,
    credentials: {
      client_email: this.json.client_email,
      private_key: this.json.private_key.replace(/\\n/g, '\n'), // 這裡保留替換，因為 private_key 內部仍是轉義字符
    },
  });

  private async fetchWithTimeout(url: string, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  private async safeFetchSchedule(travel_no: string, retry = 3) {
    const url = `https://t1.besttour.com.tw/api/travel_detail_schedule.asp?travel_no=${travel_no}`;

    for (let i = 0; i < retry; i++) {
      try {
        const res = await this.fetchWithTimeout(url, 10000);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as QueryListNew;
        return (json.data as ScheduleDto[]) ?? [];
      } catch (err) {
        console.error(`Fetch schedule failed (attempt ${i + 1}):`, err);

        // 最後一次也失敗 → 回傳空陣列，不阻塞流程
        if (i === retry - 1) return [];
        await wait(500 * (i + 1)); // 重試前稍微等一下（退避）
      }
    }

    return [];
  }

  async addScheduleToQueryList(data: QueryListNew): Promise<QueryListNew> {
    await Promise.all(
      data.data.map(async (item) => {
        const travel_no = item.travel?.[0]?.travel_no;

        console.log('Processing item:', travel_no);

        if (!travel_no) {
          item.schedule = [];
          return;
        }

        const schedule = await this.safeFetchSchedule(travel_no);
        item.schedule = schedule;
      }),
    );

    // ✅ 回傳 data 陣列而不是整個物件
    console.log(`✅ 處理完成: ${data.data.length} 筆行程資料`);
    return data; // 回傳陣列
  }

  // 將 QuerylistDto 轉成 RawData
  splitData(fullScheduleData: QuerylistDto[]): ScheduleSplitDto {
    return dataCleaner(fullScheduleData);
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number) {
    return `This action updates a #${id} schedule`;
  }

  async merge(rows: QuerylistDto[]) {
    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT;
      const datasetId = process.env.BIGQUERY_DATASET as string;
      const tableId = 'SCHEDULE_DB';
      console.log(`準備 merge ${rows.length} 筆資料到 ${tableId}`);

      // 建立臨時資料表名稱
      const tempTableId = `${tableId}_temp_${Date.now()}`;
      const tempTable = this.bigquery.dataset(datasetId).table(tempTableId);

      // 1. 先插入資料到臨時表
      await tempTable.create({
        schema: {
          fields: [
            { name: 'name', type: 'STRING', mode: 'REQUIRED' },
            { name: 'id', type: 'STRING', mode: 'NULLABLE' },
            { name: 'img', type: 'STRING', mode: 'NULLABLE' },
            { name: 'city', type: 'STRING', mode: 'NULLABLE' },
            { name: 'slogan', type: 'STRING', mode: 'NULLABLE' },
            { name: 'day', type: 'STRING', mode: 'NULLABLE' },
            { name: 'price', type: 'INTEGER', mode: 'NULLABLE' },
            // travel 陣列
            {
              name: 'travel',
              type: 'RECORD',
              mode: 'REPEATED',
              fields: [
                { name: 'date', type: 'STRING', mode: 'NULLABLE' },
                { name: 'travel_no', type: 'STRING', mode: 'NULLABLE' },
                { name: 'price', type: 'INTEGER', mode: 'NULLABLE' },
              ],
            },
            // schedule 陣列
            {
              name: 'schedule',
              type: 'RECORD',
              mode: 'REPEATED',
              fields: [
                { name: 'day', type: 'STRING', mode: 'NULLABLE' },
                { name: 'date', type: 'STRING', mode: 'NULLABLE' },
                { name: 'title', type: 'STRING', mode: 'NULLABLE' },
                // route 是字串陣列
                { name: 'route', type: 'STRING', mode: 'REPEATED' },
                // hotel 物件
                {
                  name: 'hotel',
                  type: 'RECORD',
                  mode: 'NULLABLE',
                  fields: [
                    { name: 'status', type: 'STRING', mode: 'NULLABLE' },
                    {
                      name: 'data',
                      type: 'RECORD',
                      mode: 'REPEATED',
                      fields: [
                        { name: 'name', type: 'STRING', mode: 'NULLABLE' },
                        { name: 'url', type: 'STRING', mode: 'NULLABLE' },
                      ],
                    },
                  ],
                },
                // food 是字串陣列
                { name: 'food', type: 'STRING', mode: 'REPEATED' },
                { name: 'abstract_1', type: 'STRING', mode: 'NULLABLE' },
                // abstract_2 是物件陣列
                {
                  name: 'abstract_2',
                  type: 'RECORD',
                  mode: 'REPEATED',
                  fields: [
                    { name: 'id', type: 'STRING', mode: 'NULLABLE' },
                    { name: 'name', type: 'STRING', mode: 'NULLABLE' },
                  ],
                },
              ],
            },
            // tags 是字串陣列
            { name: 'tags', type: 'STRING', mode: 'REPEATED' },
          ],
        },
      });

      await tempTable.insert(rows);

      // 2. 執行 MERGE 語句
      const mergeQuery = `
        MERGE \`${projectId}.${datasetId}.${tableId}\` AS target
        USING \`${projectId}.${datasetId}.${tempTableId}\` AS source
        ON target.name = source.name AND target.id = source.id
        WHEN MATCHED THEN
          UPDATE SET
            img = source.img,
            city = source.city,
            slogan = source.slogan,
            day = source.day,
            travel = source.travel,
            schedule = source.schedule,
            tags = source.tags
        WHEN NOT MATCHED THEN
          INSERT (name, id, img, city, slogan, day, travel, schedule, tags)
          VALUES (source.name, source.id, source.img, source.city, source.slogan,
                  source.day, source.travel, source.schedule, source.tags)
      `;

      console.log('執行 MERGE 查詢...');
      const [job] = await this.bigquery.createQueryJob({
        query: mergeQuery,
        location: 'US', // 或你的資料集位置
      });

      const [rows_affected] = await job.getQueryResults();

      // 3. 清理臨時表
      await tempTable.delete();

      console.log(`成功 merge 資料到 BigQuery`);
      return {
        success: true,
        processedRows: rows.length,
        affectedRows: rows_affected.length,
        operation: 'merge',
      };
    } catch (error) {
      console.error('BigQuery merge 失敗:', error);
      throw error;
    }
  }
}
