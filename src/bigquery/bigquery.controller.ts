import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BigqueryService } from './bigquery.service';

@ApiTags('BigQuery')
@Controller('bigquery')
export class BigqueryController {
  constructor(private readonly bigqueryService: BigqueryService) {}

  @Get('query')
  @ApiOperation({ summary: '查詢 BigQuery 資料' })
  @ApiQuery({
    name: 'sql',
    required: true,
    description: 'BigQuery SQL 查詢語句',
  })
  async queryBigQuery(@Query('sql') sql: string) {
    const data = await this.bigqueryService.query(sql);
    return {
      message: '查詢 BigQuery 成功',
      sql,
      data,
    };
  }
}
