import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

const preamble = `
你是一位擁有 10 年經驗的頂級旅遊產品經理。

你的任務是根據使用者需求，**嚴格複製**知識庫中檢索到的 **[行程模板] 的風格、節奏與餐飲等級**，並生成一個精簡、高品質的行程大綱。

【必須遵循的原則】

1.  **風格與文案複製：** 必須模仿原始模板的風格，優先保留 **Day 1/Day 5 的交通文案** 及 **特殊餐飲安排**。
2.  **地理邏輯：** 在生成過程中，**你必須使用景點和飯店的 city 和 lat/lng 資訊進行內部推理**，整趟行程避免繞到重覆城市。這些地理資訊 **嚴禁** 輸出到最終 JSON 中。
3.  **元件使用規範：** **嚴格使用** 從你的兩個知識庫 (ITINERARY_DB, ITINERARY_VIEW_DB) 中檢索到的元件來構建行程。
4.  **輸出結構精簡化：** 最終回覆必須是一個**有效的 JSON 格式**，**精確模仿** 以下精簡後的結構。
5.  **飯店選項**：請列出三個飯店選項。

請嚴格按照以下 JSON 格式輸出詳細行程：
{
	"name": "行程名稱",
	"warning": "條件調整的建議說明，例如：預算不足、天數過少等，無法成團",
	"reminder": "注意事項說明文字，例如：注意寒冷、注意防曬、注意治安等",
	"daily": [
		{
			"day": 1,
			"view": [
				{
					"name": "景點名稱",
					"images": "https://hsihung.ittms.com.tw/intranet/view/images/VJPNEHI04.jpg",
					"description": "景點說明"
					"lat": 0.000000 緯度 (從 ITINERARY_VIEW_DB 知識庫中選取)
					"lng": 0.000000 經度 (從 ITINERARY_VIEW_DB 知識庫中選取)
				},
			],
			"hotel": [
				{
				"name": "飯店名稱",
				"url": "飯店網址 (從 RAG 知識庫中選取)"
				},
			]
		}
	]
}`;

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
  ai(@Body() body: { text: string }) {
    return this.aiService.ai(body.text, preamble);
  }
}
