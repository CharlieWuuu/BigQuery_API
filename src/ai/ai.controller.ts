import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
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
  ai(@Body() body: { text: string }) {
    return this.aiService.ai(body.text);
  }
}
