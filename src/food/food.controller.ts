import { Controller, Post, Body, Get } from '@nestjs/common';
import { FoodService } from './food.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { FoodDto } from 'src/common/dto/food.dto';
import { dataEnrich } from 'src/common/utils/data_enrich';

const rawData: FoodDto[] = [
  { name: '捷克風味餐', raw_text: '捷克風味餐', city: '', type: 'lunch' },
];

const insertData: FoodDto[] = [
  { name: '捷克風味餐', raw_text: '捷克風味餐', city: '布拉格', type: 'lunch' },
];

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '查詢 BigQuery 資料' })
  findAll() {
    return '開發中...';
  }

  @Post('/enrich')
  @ApiOperation({ summary: '✅ 以 AI 補足資料細節' })
  @ApiBody({
    description: `請貼上飯店資料 JSON：`,
    examples: {
      example1: { summary: '測試用行程資料', value: { data: rawData } },
    },
  })
  async enrich(@Body() body: { data: FoodDto[] }): Promise<FoodDto[]> {
    console.log('✅ 以 AI 補足資料細節');
    return dataEnrich(body.data, 'food');
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  @ApiBody({
    description: `請貼上飯店資料 JSON：`,
    examples: {
      example1: { summary: '測試用行程資料', value: { data: insertData } },
    },
  })
  async merge(@Body() body: { data: FoodDto[] }) {
    console.log('✅ 開始上傳資料到 BigQuery');
    return this.foodService.merge(body.data);
  }
}
