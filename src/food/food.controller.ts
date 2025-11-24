import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { FoodService } from './food.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateFoodDto } from './dto/create-food.dto';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('/enriched')
  @ApiOperation({ summary: '回傳利用 AI enriched 後的 food 資料' })
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @Get('/bigquery')
  @ApiOperation({ summary: '回傳 food 資料' })
  findAll() {
    return this.foodService.findAll();
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '上傳利用 AI enriched 後的 food 資料' })
  update(@Body() createFoodDto: CreateFoodDto) {
    return this.foodService.create(createFoodDto);
  }

  @Delete('/bigquery')
  @ApiOperation({ summary: '刪除 BigQuery 中的過期 food 資料' })
  remove() {
    return this.foodService.remove(0);
  }
}
