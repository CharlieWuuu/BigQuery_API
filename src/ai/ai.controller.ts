import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('/detail')
  @ApiOperation({ summary: '✅ Vertex AI' })
  @ApiBody({
    description: '要處理的文字內容',
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: '輸入文字',
          example: '請給我福岡五天四夜的行程',
        },
      },
      required: ['text'],
    },
  })
  ai_tour(@Body() body: { text: string }) {
    return this.aiService.ai_tour(body.text);
  }
}
