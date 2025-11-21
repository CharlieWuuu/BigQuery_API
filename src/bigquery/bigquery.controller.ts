import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BigqueryService } from './bigquery.service';
import { InsertBigQueryDto } from './bigquery.dto';

@ApiTags('BigQuery')
@Controller('bigquery')
export class BigqueryController {
  constructor(private readonly bigqueryService: BigqueryService) {}

  @Get('query')
  @ApiOperation({ summary: '查詢 BigQuery 資料' })
  async queryBigQuery() {
    try {
      const sql =
        'SELECT * FROM custom-graph-328814.Bestour_AI.TEST_VIEW_DB limit 20';
      const data = await this.bigqueryService.query(sql);
      return { message: '查詢成功', data };
    } catch (error) {
      return { message: '查詢失敗', error: error.message as string };
    }
  }

  //   {
  //   "table": "Bestour_AI.TEST_VIEW_DB",
  //   "rows": [
  //     {
  //       "lat": 135.843478,
  //       "lng": 34.6847216,
  //       "name": "奈良梅花鹿公園",
  //       "description": "與梅花鹿近距離互動的公園",
  //       "tags": ["歷史文化"],
  //       "raw_name": "紅葉名所◆奈良梅花鹿公園",
  //       "city": "奈良",
  //       "id": "UUID-TEST-001"
  //     }
  //   ]
  // }
  @Post('insert')
  @ApiOperation({ summary: '插入資料到 BigQuery' })
  async insertBigQuery(@Body() body: InsertBigQueryDto) {
    try {
      const result = await this.bigqueryService.insert(body.table, body.rows);
      return { message: '插入成功', result };
    } catch (error) {
      return { message: '插入失敗', error: error.message as string };
    }
  }
}
