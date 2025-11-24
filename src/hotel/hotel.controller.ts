import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('/enriched')
  @ApiOperation({ summary: '回傳利用 AI enriched 後的 hotel 資料' })
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.create(createHotelDto);
  }

  @Get('/bigquery')
  @ApiOperation({ summary: '回傳 hotel 資料' })
  findAll() {
    return this.hotelService.findAll();
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '上傳利用 AI enriched 後的 hotel 資料' })
  update(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.create(createHotelDto);
  }

  @Delete('/bigquery')
  @ApiOperation({ summary: '刪除 BigQuery 中的過期 hotel 資料' })
  remove() {
    return this.hotelService.remove(0);
  }
}
