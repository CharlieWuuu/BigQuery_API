import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

// 【必須遵循的原則】

// 1.  **目標優先級：** 你的最高目標是**嚴格滿足使用者在 preferText 中提及的行程名稱和關鍵元素**（例如：由布院之森、柳川搖船）。如果知識庫中有符合這些元素的元件，必須優先使用。
//     * **風格與文案：** 保持頂級旅遊產品經理的專業和精煉風格。

// 2.  **每日景點數量與資料補足 (硬性要求)：**
//     * 每一天的 "view" 陣列中，景點數量必須**嚴格符合**用戶選擇的範圍：<您選擇的每日景點數量範圍，例如 5-6> 個之間。

// 3.  **元件使用規範：**
//     * **景點 (view)：** 必須從 ITINERARY_VIEW_DB 知識庫中選取。
//     * **行程組合：** 必須根據使用者在 preferText 中定義的**旅遊地點、旅遊風格、行程節奏**（例如：一日 5-6 個景點）**重新組合**，而不是複製任何單一的現成模板。

// 4.  **輸出結構與完整性 (新增最高優先級原則)：**
//     * **嚴格**輸出一個**完整且有效的 JSON 格式**。
//     * **嚴禁**在 JSON 結構開始 (\`\`\`json) 或結束 (\`\`\`) 之外，包含任何額外的文字、註釋或程式碼。
//     * **JSON 結構中所有鍵值對 (Key-Value Pairs) 必須完整**，特別是 **"view" 必須為有效的 JSON 陣列**。

const preamble = `
你是一位擁有 10 年經驗的頂級旅遊產品經理。

你的任務是**嚴格依據使用者明確指定的需求 (preferText)**，從你的知識庫中**智慧化選取並組合**景點，以生成一個精簡、高品質、**完全客製化**的行程大綱。

【必須遵循的原則】

-   **每日景點數量與資料補足 (硬性要求)：**
		* 每一天的 "view" 陣列中，景點數量必須**嚴格符合**用戶選擇的範圍：<您選擇的每日景點數量範圍，例如 5-6> 個之間。

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
					"view_id": "ITINERARY_VIEW_DB 中的景點 ID，找不到就留空",
					"view_title": "景點名稱",
					"lat": 35,
					"lng": 121
				},
			],
		}
	]
}`;

const preamble_view = `請你查詢每個景點的描述，請到 ITINERARY_VIEW_DB 知識庫中查找 view_content，並放回原本的 JSON 結構中，新增一個 "view_content" 鍵值對，內容是該景點的描述文字。`;

const viewExample = `
[
	{
		view_id: 'VJPNKUM08',
		view_title: '熊本城【日本三大名城之一】',
		lat: 32.8,
		lng: 130.7,
	},
]`;

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
  detail(@Body() body: { text: string }) {
    return this.aiService.ai(body.text, preamble);
  }

  @Post('/viewDescription')
  @ApiOperation({ summary: '✅ Vertex AI' })
  @ApiBody({
    description: '要處理的文字內容',
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: '輸入文字', example: viewExample },
      },
      required: ['text'],
    },
  })
  viewDescription(@Body() body: { text: string }) {
    return this.aiService.ai(body.text, preamble_view);
  }
}
