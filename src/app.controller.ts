import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('updateData')
  @ApiOperation({ summary: '資料更新的總入口' })
  updateData(): string {
    return this.appService.updateData();
  }
}
