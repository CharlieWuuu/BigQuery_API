import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Body } from '@nestjs/common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('updateData')
  @ApiOperation({ summary: '資料更新的總入口' })
  async updateData(): Promise<string> {
    return this.appService.updateData();
  }

  @Post('updateDataTourData')
  @ApiOperation({ summary: '資料更新 Tour Data 總入口' })
  @ApiBody({
    description: '每頁筆數與頁碼',
    required: true,
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        page_count: { type: 'number', example: 10 },
      },
    },
  })
  async updateDataTourData(
    @Body() { page, page_count }: { page: number; page_count: number },
  ): Promise<{ status: string; msg: string }> {
    return this.appService.updateDataTourData(page, page_count);
  }
}
