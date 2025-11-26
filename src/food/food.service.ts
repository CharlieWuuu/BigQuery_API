import { Injectable } from '@nestjs/common';
import { FoodDto } from 'src/common/dto/food.dto';
import { dataEnrich } from './data_enrich';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class FoodService {
  private rawBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  private jsonString = Buffer.from(this.rawBase64, 'base64').toString('utf8');
  private json = JSON.parse(this.jsonString);

  private bigquery: BigQuery = new BigQuery({
    projectId: this.json.project_id,
    credentials: {
      client_email: this.json.client_email,
      private_key: this.json.private_key.replace(/\\n/g, '\n'), // 這裡保留替換，因為 private_key 內部仍是轉義字符
    },
  });

  async enrich(data: FoodDto[]): Promise<FoodDto[]> {
    console.log(data);
    const result = await dataEnrich(data);
    return result;
  }
  create() {
    return 'This action adds a new food';
  }

  findAll() {
    return `This action returns all food`;
  }

  update(id: number) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }

  async merge(rows: FoodDto[]) {
    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT;
      const datasetId = process.env.BIGQUERY_DATASET as string;
      const tableId = 'FOOD_DB';
      console.log(`準備 merge ${rows.length} 筆資料到 ${tableId}`);

      // 建立臨時資料表名稱
      const tempTableId = `${tableId}_temp_${Date.now()}`;
      const tempTable = this.bigquery.dataset(datasetId).table(tempTableId);

      // 1. 先插入資料到臨時表
      await tempTable.create({
        schema: {
          fields: [
            { name: 'name', type: 'STRING', mode: 'NULLABLE' },
            { name: 'raw_text', type: 'STRING', mode: 'NULLABLE' },
            { name: 'city', type: 'STRING', mode: 'NULLABLE' },
            { name: 'type', type: 'STRING', mode: 'NULLABLE' },
          ],
        },
      });

      await tempTable.insert(rows);

      // 2. 執行 MERGE 語句
      const mergeQuery = `
            MERGE \`${projectId}.${datasetId}.${tableId}\` AS target
            USING \`${projectId}.${datasetId}.${tempTableId}\` AS source
            ON target.name = source.name
            WHEN MATCHED THEN
              UPDATE SET
                name = source.name,
                raw_text = source.raw_text,
                city = source.city,
                type = source.type
            WHEN NOT MATCHED THEN
              INSERT (name, raw_text, city, type)
              VALUES (source.name, source.raw_text, source.city, source.type)
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
