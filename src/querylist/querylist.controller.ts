import { Query, Controller, Get } from '@nestjs/common';
import { QuerylistService } from './querylist.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('DataProcessing')
export class QuerylistController {
  constructor(private readonly QuerylistService: QuerylistService) {}

  @Get('/querylist')
  @ApiOperation({ summary: '✅ 查詢 Querylist' })
  @ApiQuery({
    name: 'pageid',
    description: '頁碼',
    required: false,
    type: Number,
    example: 1,
  })
  querylist(@Query('pageid') pageid?: number) {
    return this.QuerylistService.get(pageid ?? 1);
  }

  @Get('/tourData')
  @ApiOperation({ summary: '✅ 查詢 Tour Data' })
  @ApiQuery({
    name: 'pageid',
    description: '頁碼',
    required: true,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'page_count',
    description: '每頁筆數',
    required: true,
    type: Object,
    example: 10,
  })
  tourData(
    @Query('pageid') page: number,
    @Query('page_count') page_count: number,
  ) {
    return this.QuerylistService.tourData(page, page_count);
  }
}
