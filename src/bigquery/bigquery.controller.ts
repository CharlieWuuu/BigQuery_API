import { Controller, Get, Param, Delete } from '@nestjs/common';
import { BigqueryService } from './bigquery.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('bigquery')
export class BigqueryController {
  constructor(private readonly bigqueryService: BigqueryService) {}

  // @Post()
  // create(@Body() createBigqueryDto: CreateBigqueryDto) {
  //   return this.bigqueryService.create(createBigqueryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.bigqueryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bigqueryService.findOne(+id);
  // }

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

  // @Post('view')
  // @ApiOperation({ summary: '插入 view 資料到 BigQuery' })
  // insertView(@Body() body: any) {
  //   return this.bigqueryService.insert('Bestour_AI.TEST_VIEW_DB', body);
  // }

  // @Post('food')
  // @ApiOperation({ summary: '插入 food 資料到 BigQuery' })
  // insertFood(@Body() body: any) {
  //   return this.bigqueryService.insert('Bestour_AI.TEST_FOOD_DB', body);
  // }

  // @Post('hotel')
  // @ApiOperation({ summary: '插入 hotel 資料到 BigQuery' })
  // insertHotel(@Body() body: any) {
  //   return this.bigqueryService.insert('Bestour_AI.TEST_HOTEL_DB', body);
  // }

  // @Post('schedule_cleared')
  // @ApiOperation({ summary: '插入 schedule_cleared 資料到 BigQuery' })
  // insertScheduleCleared(@Body() body: any) {
  //   return this.bigqueryService.insert(
  //     'Bestour_AI.TEST_SCHEDULE_CLEARED_DB',
  //     body,
  //   );
  // }

  @Delete()
  @ApiOperation({ summary: '刪除過時的資訊' })
  remove(@Param('id') id: string) {
    return this.bigqueryService.remove(+id);
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
