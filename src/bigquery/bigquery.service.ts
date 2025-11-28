import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import { GoogleCredentialJson } from 'src/common/type/googleCredentail.type';

@Injectable()
export class BigqueryService {
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

  async query(sql: string) {
    try {
      const [rows] = await this.bigquery.query({ query: sql });
      return rows as [];
    } catch (error) {
      console.error('BigQuery 查詢失敗:', error);
      throw error;
    }
  }

  async insert(table: string, rows: object[]) {
    try {
      // 支援 table 格式: dataset.table 或 project.dataset.table
      const parts = table.split('.');
      let datasetId: string;
      let tableId: string;

      if (parts.length === 2) {
        [datasetId, tableId] = parts;
      } else if (parts.length === 3) {
        [, datasetId, tableId] = parts;
      } else {
        throw new Error(
          'table 格式錯誤，請用 dataset.table 或 project.dataset.table',
        );
      }

      const result = await this.bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(rows);
      return { success: true, result };
    } catch (error) {
      console.error('BigQuery 插入失敗:', error);
      throw error;
    }
  }

  async insertView(rows: object[]) {
    return this.insert('Bestour_AI.TEST_VIEW_DB', rows);
  }

  async insertFood(rows: object[]) {
    return this.insert('Bestour_AI.TEST_FOOD_DB', rows);
  }

  async insertHotel(rows: object[]) {
    return this.insert('Bestour_AI.TEST_HOTEL_DB', rows);
  }

  async insertScheduleCleared(rows: object[]) {
    return this.insert('Bestour_AI.TEST_SCHEDULE_CLEARED_DB', rows);
  }
}
