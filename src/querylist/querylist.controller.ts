import { Controller, Get } from '@nestjs/common';
import { QuerylistService } from './querylist.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('Querylist')
export class QuerylistController {
  constructor(private readonly QuerylistService: QuerylistService) {}

  @Get()
  @ApiOperation({ summary: 'GET query_list' })
  findAll() {
    return this.QuerylistService.findAll();
  }
}
