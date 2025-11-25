import { Injectable } from '@nestjs/common';
import { ViewDto } from 'src/common/dto/view.dto';
import { dataEnrich } from './data_enrich';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class ViewService {
  private readonly bigquery: BigQuery;

  constructor() {
    this.bigquery = new BigQuery();
  }

  async enrich(data: ViewDto[]) {
    const result = await dataEnrich(data);
    return result;
  }

  // async insert(table: string, rows: ViewDto[]) {
  //   try {
  //     // 支援 table 格式: dataset.table 或 project.dataset.table
  //     const parts = table.split('.');
  //     let datasetId: string;
  //     let tableId: string;

  //     if (parts.length === 2) {
  //       [datasetId, tableId] = parts;
  //     } else if (parts.length === 3) {
  //       [, datasetId, tableId] = parts;
  //     } else {
  //       throw new Error(
  //         'table 格式錯誤，請用 dataset.table 或 project.dataset.table',
  //       );
  //     }

  //     console.log(`準備插入 ${rows.length} 筆資料到 ${datasetId}.${tableId}`);

  //     const result = await this.bigquery
  //       .dataset(datasetId)
  //       .table(tableId)
  //       .insert(rows);

  //     console.log(`✅ 成功插入 ${rows.length} 筆資料到 BigQuery`);
  //     return {
  //       success: true,
  //       insertedRows: rows.length,
  //       result,
  //     };
  //   } catch (error) {
  //     console.error('BigQuery 插入失敗:', error);

  //     // 如果是部分插入失敗，顯示詳細錯誤
  //     if (error.name === 'PartialFailureError') {
  //       console.error('部分插入失敗的詳細錯誤:', error.errors);
  //     }

  //     throw error;
  //   }
  // }

  async merge(rows: ViewDto[]) {
    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT;
      const datasetId = process.env.BIGQUERY_DATASET as string;
      const tableId = 'VIEW_DB';
      console.log(`準備 merge ${rows.length} 筆資料到 ${tableId}`);

      // 建立臨時資料表名稱
      const tempTableId = `${tableId}_temp_${Date.now()}`;
      const tempTable = this.bigquery.dataset(datasetId).table(tempTableId);

      // 1. 先插入資料到臨時表
      await tempTable.create({
        schema: {
          fields: [
            { name: 'id', type: 'STRING', mode: 'REQUIRED' },
            { name: 'name', type: 'STRING', mode: 'NULLABLE' },
            { name: 'raw_name', type: 'STRING', mode: 'NULLABLE' },
            { name: 'description', type: 'STRING', mode: 'NULLABLE' },
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
        ON target.id = source.id
        WHEN NOT MATCHED THEN
          INSERT (id, name, raw_name, description, city, tags, lat, lng)
          VALUES (source.id, source.name, source.raw_name, source.description,
                  source.city, source.tags, source.lat, source.lng)
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
