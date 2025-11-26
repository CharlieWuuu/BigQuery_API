import { Controller, Post, Body, Get } from '@nestjs/common';
import { FoodService } from './food.service';
import { ApiOperation } from '@nestjs/swagger';
import { FoodDto } from 'src/common/dto/food.dto';

// const rawData: FoodDto[] = [
//   { name: '捷克風味餐', raw_text: '捷克風味餐', city: '', type: 'lunch' },
//   { name: '捷克烤鴨餐', raw_text: '捷克烤鴨餐', city: '', type: 'dinner' },
//   {
//     name: '伏爾塔瓦河遊船自助百匯',
//     raw_text: '伏爾塔瓦河遊船自助百匯',
//     city: '',
//     type: 'lunch',
//   },
// ];

// const insertData: FoodDto[] = [
//   { name: '捷克風味餐', raw_text: '捷克風味餐', city: '布拉格', type: 'lunch' },
//   {
//     name: '捷克烤鴨餐',
//     raw_text: '捷克烤鴨餐',
//     city: '布拉格',
//     type: 'dinner',
//   },
//   {
//     name: '伏爾塔瓦河遊船自助百匯',
//     raw_text: '伏爾塔瓦河遊船自助百匯',
//     city: '布拉格',
//     type: 'lunch',
//   },
// ];

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '查詢 BigQuery 資料' })
  findAll() {
    return this.foodService.findAll();
  }

  @Post('/enrich')
  @ApiOperation({ summary: '✅ 以 AI 補足資料細節' })
  async enrich(@Body() body?: { data?: FoodDto[] }): Promise<FoodDto[]> {
    if (!body?.data || body.data.length === 0) {
      console.log('⚠️ 沒有傳入美食資料，回傳空陣列');
      return [];
    }

    return this.foodService.enrich(body.data);
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  async merge(@Body() body: { data: FoodDto[] }) {
    console.log('✅ 上傳資料到 BigQuery');
    if (!body?.data || body.data.length === 0) {
      console.log('⚠️ 沒有傳入飯店資料，使用測試資料');
      return this.foodService.merge([]); // 手動測試時使用假資料
    }

    console.log('✅ 使用真實資料上傳到 BigQuery');
    return this.foodService.merge(body.data);
  }
}
