import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigqueryService {
  private bigquery = new BigQuery();

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
}
