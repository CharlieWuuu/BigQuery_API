import { Injectable } from '@nestjs/common';
import { HotelDto } from 'src/common/dto/hotel.dto';
import { BigQuery } from '@google-cloud/bigquery';
import { GoogleCredentialJson } from 'src/common/type/googleCredentail.type';
import { dataEnrich } from 'src/common/utils/data_enrich';

@Injectable()
export class HotelService {
  private rawBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  private jsonString = Buffer.from(this.rawBase64, 'base64').toString('utf8');
  private json = JSON.parse(this.jsonString) as GoogleCredentialJson;
  private bigquery: BigQuery = new BigQuery({
    projectId: this.json.project_id,
    credentials: {
      client_email: this.json.client_email,
      private_key: this.json.private_key.replace(/\\n/g, '\n'),
    },
  });

  async enrich(data: HotelDto[]): Promise<HotelDto[]> {
    return dataEnrich(data, 'hotel');
  }

  async merge(rows: HotelDto[]) {
    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT;
      const datasetId = process.env.BIGQUERY_DATASET as string;
      const tableId = 'HOTEL_DB';
      console.log(`準備 merge ${rows.length} 筆資料到 ${tableId}`);

      // 建立臨時資料表名稱
      const tempTableId = `${tableId}_temp_${Date.now()}`;
      const tempTable = this.bigquery.dataset(datasetId).table(tempTableId);

      // 1. 先插入資料到臨時表
      await tempTable.create({
        schema: {
          fields: [
            { name: 'name', type: 'STRING', mode: 'NULLABLE' },
            { name: 'url', type: 'STRING', mode: 'NULLABLE' },
            { name: 'city', type: 'STRING', mode: 'NULLABLE' },
            { name: 'tags', type: 'STRING', mode: 'REPEATED' },
            { name: 'lat', type: 'FLOAT', mode: 'NULLABLE' },
            { name: 'lng', type: 'FLOAT', mode: 'NULLABLE' },
          ],
        },
      });

      await tempTable.insert(rows);

      // 2. 執行 MERGE 語句
      const mergeQuery = `
          MERGE \`${projectId}.${datasetId}.${tableId}\` AS target
          USING \`${projectId}.${datasetId}.${tempTableId}\` AS source
          ON target.name = source.name
          WHEN NOT MATCHED THEN
            INSERT (name, url, city, tags, lat, lng)
            VALUES (source.name, source.url, source.city, source.tags, source.lat, source.lng)
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
