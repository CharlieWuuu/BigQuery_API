import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { FoodService } from './food.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodDto } from 'src/common/dto/food.dto';

const insertData: FoodDto[] = [
  { name: '捷克風味餐', raw_text: '捷克風味餐', city: '布拉格', type: 'lunch' },
  {
    name: '捷克烤鴨餐',
    raw_text: '捷克烤鴨餐',
    city: '布拉格',
    type: 'dinner',
  },
  {
    name: '伏爾塔瓦河遊船自助百匯',
    raw_text: '伏爾塔瓦河遊船自助百匯',
    city: '布拉格',
    type: 'lunch',
  },
];

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '從 BigQuery 取得資料' })
  findAll() {
    return this.foodService.findAll();
  }

  @Post('/enrich')
  @ApiOperation({ summary: '以 AI 補足資料細節' })
  // enrich(@Body() data: ViewDto[]) {
  enrich(): Promise<FoodDto[]> {
    const data: FoodDto[] = [
      { name: '捷克風味餐', raw_text: '捷克風味餐', city: '' },
      { name: '捷克烤鴨餐', raw_text: '捷克烤鴨餐', city: '' },
      {
        name: '伏爾塔瓦河遊船自助百匯',
        raw_text: '伏爾塔瓦河遊船自助百匯',
        city: '',
      },
    ];
    return this.foodService.enrich(data);
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '上傳資料到 BigQuery' })
  async merge(@Body() body: { data: FoodDto[] }) {
    console.log('Received data for BigQuery merge:', body);
    if (body === undefined) {
      body = { data: insertData };
    }
    const result = await this.foodService.merge(body.data);
    return result;
  }
}
