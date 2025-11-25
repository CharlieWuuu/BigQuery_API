import { Query, Controller, Get } from '@nestjs/common';
import { QuerylistService } from './querylist.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('Querylist')
export class QuerylistController {
  constructor(private readonly QuerylistService: QuerylistService) {}

  @Get()
  @ApiOperation({ summary: '✅ 查詢 Querylist' })
  @ApiQuery({
    name: 'pageid',
    description: '頁碼',
    required: false,
    type: Number,
    example: 1,
  })
  get(@Query('pageid') pageid?: number) {
    return this.QuerylistService.get(pageid ?? 1);
  }
}
