import { Controller, Get, Delete } from '@nestjs/common';
import { BigqueryService } from './bigquery.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('bigquery')
export class BigqueryController {
  constructor(private readonly bigqueryService: BigqueryService) {}

  @Get('query')
  @ApiOperation({ summary: '✅ 查詢 BigQuery 資料' })
  async queryBigQuery() {
    try {
      const sql =
        'SELECT * FROM custom-graph-328814.Bestour_AI.TEST_VIEW_DB limit 20';
      const data = await this.bigqueryService.query(sql);
      return { message: '查詢成功', data };
    } catch (error) {
      return { message: '查詢失敗', error: (error as Error).message };
    }
  }

  @Delete()
  @ApiOperation({ summary: '⛔ 刪除過時資訊' })
  remove() {
    return '開發中...';
  }

  // 1. /schedule GET query_list
  // 2. /schedule POST query_list，每個 list 打 API 取得 schedule，嵌入 query_list 並且回傳
  // 3. /schedule POST query_list_with_schedule，回傳 view, hotel, food, schedule_cleared
  // 4. /view POST view，回傳利用 AI enriched 後的 view 資料
  // 5. /hotel POST hotel，回傳利用 AI enriched 後的 hotel 資料
  // 6. /food POST food，回傳利用 AI enriched 後的 food 資料
  // 7. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
  // 8. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
  // 9. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
  // 10. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
}
