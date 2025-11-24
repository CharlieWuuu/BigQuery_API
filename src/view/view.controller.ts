import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { ViewService } from './view.service';
import { CreateViewDto } from './dto/create-view.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Post('/enriched')
  @ApiOperation({ summary: '回傳利用 AI enriched 後的 hotel 資料' })
  create(@Body() createViewDto: CreateViewDto) {
    return this.viewService.create(createViewDto);
  }

  @Get('/bigquery')
  @ApiOperation({ summary: '回傳 hotel 資料' })
  findAll() {
    return this.viewService.findAll();
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '上傳利用 AI enriched 後的 hotel 資料' })
  update(@Body() createViewDto: CreateViewDto) {
    return this.viewService.create(createViewDto);
  }

  @Delete('/bigquery')
  @ApiOperation({ summary: '刪除 BigQuery 中的過期 hotel 資料' })
  remove() {
    return this.viewService.remove(0);
  }
}
