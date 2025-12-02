import { Injectable } from '@nestjs/common';
import { ViewDto } from 'src/common/dto/view.dto';
import { BigQuery } from '@google-cloud/bigquery';
import type { GoogleCredentialJson } from 'src/common/type/googleCredential.type';
import { ViewContent } from 'src/common/type/itinerary.type';

@Injectable()
export class ViewService {
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

  async queryViewNotEnrichedId() {
    try {
      const [rows] = await this.bigquery.query({
        query: `
        SELECT view_id
        FROM ${process.env.GOOGLE_CLOUD_PROJECT}.${process.env.BIGQUERY_DATASET}.ITINERARY_VIEW_DB
        WHERE lat = 0 OR lng = 0
        `,
      });

      console.log(
        '[ view.service ] 查詢缺少經緯度的 view_id 數量:',
        rows.length,
      );
      return rows.flatMap((row) => row.view_id) as string[];
    } catch (error) {
      console.error('[ view.service ] BigQuery 查詢失敗:', error);
      throw error;
    }
  }

  async queryView(view_id_Arr: string[]) {
    try {
      const view = await this.bigquery.query({
        query: `
        SELECT *
        FROM ${process.env.GOOGLE_CLOUD_PROJECT}.${process.env.BIGQUERY_DATASET}.ITINERARY_VIEW_DB
        WHERE view_id IN UNNEST(@view_id_Arr)
        `,
        params: { view_id_Arr },
      });

      console.log(`[ view.service ] 查詢 ${view_id_Arr.length} 筆資料`, view);
      console.log('============================================');
      return view[0] as ViewContent[];
    } catch (error) {
      console.error('[ view.service ] BigQuery 查詢失敗:', error);
      throw error;
    }
  }

  // async merge(rows: ViewDto[]) {
  //   try {
  //     const projectId = process.env.GOOGLE_CLOUD_PROJECT;
  //     const datasetId = process.env.BIGQUERY_DATASET as string;
  //     const tableId = 'VIEW_DB';
  //     console.log(`準備 merge ${rows.length} 筆資料到 ${tableId}`);

  //     // 建立臨時資料表名稱
  //     const tempTableId = `${tableId}_temp_${Date.now()}`;
  //     const tempTable = this.bigquery.dataset(datasetId).table(tempTableId);

  //     // 1. 先插入資料到臨時表
  //     await tempTable.create({
  //       schema: {
  //         fields: [
  //           { name: 'id', type: 'STRING', mode: 'REQUIRED' },
  //           { name: 'name', type: 'STRING', mode: 'NULLABLE' },
  //           { name: 'raw_name', type: 'STRING', mode: 'NULLABLE' },
  //           { name: 'description', type: 'STRING', mode: 'NULLABLE' },
  //           { name: 'city', type: 'STRING', mode: 'NULLABLE' },
  //           { name: 'tags', type: 'STRING', mode: 'REPEATED' },
  //           { name: 'lat', type: 'FLOAT', mode: 'NULLABLE' },
  //           { name: 'lng', type: 'FLOAT', mode: 'NULLABLE' },
  //         ],
  //       },
  //     });

  //     await tempTable.insert(rows);

  //     // 2. 執行 MERGE 語句
  //     const mergeQuery = `
  //       MERGE \`${projectId}.${datasetId}.${tableId}\` AS target
  //       USING \`${projectId}.${datasetId}.${tempTableId}\` AS source
  //       ON target.id = source.id
  //       WHEN NOT MATCHED THEN
  //         INSERT (id, name, raw_name, description, city, tags, lat, lng)
  //         VALUES (source.id, source.name, source.raw_name, source.description,
  //                 source.city, source.tags, source.lat, source.lng)`;

  //     console.log('執行 MERGE 查詢...');
  //     const [job] = await this.bigquery.createQueryJob({ query: mergeQuery });
  //     const [rows_affected] = await job.getQueryResults();

  //     // 3. 清理臨時表
  //     await tempTable.delete();

  //     console.log(`成功 merge 資料到 BigQuery`);
  //     return {
  //       success: true,
  //       processedRows: rows.length,
  //       affectedRows: rows_affected.length,
  //       operation: 'merge',
  //     };
  //   } catch (error) {
  //     console.error('BigQuery merge 失敗:', error);
  //     throw error;
  //   }
  // }

  async mergeView(rows: ViewDto[] | ViewContent[]) {
    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT;
      const datasetId = process.env.BIGQUERY_DATASET as string;
      const tableId = 'ITINERARY_VIEW_DB';
      console.log(
        `[ view.service ] 準備 merge ${rows.length} 筆資料到 ${tableId}`,
      );

      // 建立臨時資料表名稱
      const tempTableId = `${tableId}_temp_${Date.now()}`;
      const tempTable = this.bigquery.dataset(datasetId).table(tempTableId);

      // 1. 先插入資料到臨時表
      await tempTable.create({
        schema: {
          fields: [
            { name: 'view_id', type: 'STRING', mode: 'NULLABLE' },
            { name: 'view_title', type: 'STRING', mode: 'NULLABLE' },
            { name: 'view_content', type: 'STRING', mode: 'NULLABLE' },
            { name: 'view_image', type: 'STRING', mode: 'NULLABLE' },
            { name: 'view_memo', type: 'STRING', mode: 'NULLABLE' },
            { name: 'city', type: 'STRING', mode: 'NULLABLE' },
            { name: 'tags', type: 'STRING', mode: 'REPEATED' },
            { name: 'lat', type: 'NUMERIC', mode: 'NULLABLE' },
            { name: 'lng', type: 'NUMERIC', mode: 'NULLABLE' },
          ],
        },
      });

      await tempTable.insert(rows);

      // 2. 執行 MERGE 語句
      const mergeQuery = `
        MERGE \`${projectId}.${datasetId}.${tableId}\` AS target
        USING \`${projectId}.${datasetId}.${tempTableId}\` AS source
        ON target.view_id = source.view_id
        WHEN MATCHED THEN
          UPDATE SET
            target.view_title = source.view_title,
            target.view_content = source.view_content,
            target.view_image = source.view_image,
            target.view_memo = source.view_memo,
            target.city = source.city,
            target.tags = source.tags,
            target.lat = source.lat,
            target.lng = source.lng
        WHEN NOT MATCHED THEN
          INSERT (view_id, view_title, view_content, view_image, view_memo, city, tags, lat, lng)
          VALUES (source.view_id, source.view_title, source.view_content, source.view_image,
                  source.view_memo, source.city, source.tags, source.lat, source.lng)`;
      console.log('[ view.service ] 執行 MERGE 查詢...');
      const [job] = await this.bigquery.createQueryJob({ query: mergeQuery });
      const [rows_affected] = await job.getQueryResults();

      // 3. 清理臨時表
      await tempTable.delete();

      console.log(`[ view.service ] 成功 merge 資料到 BigQuery`);
      return {
        success: true,
        processedRows: rows.length,
        affectedRows: rows_affected.length,
        operation: 'merge',
      };
    } catch (error) {
      console.error('[ view.service ] BigQuery merge 失敗:', error);
      throw error;
    }
  }

  // async updateView(rows: ViewContent[]) {
  //   if (!rows || rows.length === 0) {
  //     console.warn('[ view.service ] updateView 收到空批次。');
  //     return {
  //       success: true,
  //       processedRows: 0,
  //       affectedRows: 0,
  //       operation: 'merge',
  //     };
  //   }

  //   // 1. 將輸入的資料陣列轉換成 BigQuery 可接受的結構陣列
  //   const dataForMerge = rows.map((item) => ({
  //     view_id: item.view_id,
  //     city: item.city,
  //     tags: item.tags,
  //     lat: item.lat,
  //     lng: item.lng,
  //   }));

  //   console.log(dataForMerge);

  //   // 2. 準備 MERGE 查詢
  //   const query = `
  //       MERGE INTO
  //           ${process.env.GOOGLE_CLOUD_PROJECT}.${process.env.BIGQUERY_DATASET}.ITINERARY_VIEW_DB AS Target
  //       USING
  //           -- 將傳入的資料陣列 (dataForMerge) 作為臨時表 Source
  //           UNNEST(@sourceData) AS Source
  //       ON
  //           Target.view_id = Source.view_id

  //       -- 匹配到 view_id 時，執行更新
  //       WHEN MATCHED THEN
  //           UPDATE SET
  //               Target.city = Source.city,
  //               Target.tags = Source.tags,
  //               Target.lat = Source.lat,
  //               Target.lng = Source.lng

  //       -- 如果沒有匹配到，則執行插入 (可選，但 MERGE 通常用於 Upsert)
  //       WHEN NOT MATCHED THEN
  //           INSERT (view_id, city, tags, lat, lng)
  //           VALUES (Source.view_id, Source.city, Source.tags, Source.lat, Source.lng)
  //   `;

  //   try {
  //     const [job] = await this.bigquery.createQueryJob({
  //       query,
  //       // 3. 傳遞整個批次的資料陣列
  //       params: { sourceData: dataForMerge },
  //       // 4. 定義 ARRAY/STRUCT 參數的類型 (關鍵步驟!)
  //       types: [
  //         {
  //           name: 'sourceData',
  //           type: 'ARRAY',
  //           arrayType: {
  //             type: 'STRUCT',
  //             fields: [
  //               { name: 'view_id', type: 'STRING' },
  //               { name: 'city', type: 'STRING' },
  //               {
  //                 name: 'tags',
  //                 type: 'ARRAY',
  //                 arrayType: { type: 'STRING' },
  //               },
  //               { name: 'lat', type: 'FLOAT' },
  //               { name: 'lng', type: 'FLOAT' },
  //             ],
  //           },
  //         },
  //       ],
  //     });

  //     // 等待並獲取結果
  //     const [rows_affected] = await job.getQueryResults();

  //     // MERGE 語句的結果是 rows_affected[0] 中的 totalRowsAffected
  //     const summary =
  //       rows_affected && rows_affected.length > 0 ? rows_affected[0] : null;

  //     return {
  //       success: true,
  //       processedRows: rows.length,
  //       affectedRows: summary?.totalRowsAffected || 0,
  //       operation: 'merge',
  //     };
  //   } catch (error) {
  //     console.error('[ view.service ] BigQuery 批次 MERGE 失敗:', error);
  //     throw error;
  //   }
  // }
}
