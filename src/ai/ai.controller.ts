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

1.  **行程地理邏輯與經緯度強制填充 (最高優先級)**
    * **路線要求：** 每一天的景點 ("view") 排序必須符合**地理動線的邏輯性**。
    * **收尾與住宿關係 (升級自舊 Prompt)：** 每一天的 **最後一個景點** 必須在 **當日住宿城市** 的地理範圍內。每一天的第一個景點，需要鄰近前一日的住宿城市。
    * **經緯度數據：** 必須從 **ITINERARY_VIEW_DB** 中查詢取得每個景點的 \`lat\` 和 \`lng\`，並**將其用於計算和優化景點的順序**。
    * **數值鎖定：** \`lat\` 和 \`lng\` 欄位必須輸出**有效的浮點數**。**絕不能輸出 0、null 或空字串**。

2.  **地域範圍：絕對鎖定 (次高優先級)**
    * **景點選擇必須嚴格遵守**使用者在 preferText 中指定的**城市名稱**的**行政區劃內**。
    * **嚴禁**將行程擴展到任何鄰近縣市。

3. **每日景點數量：絕對硬性要求 (次高優先級)**
    * 每一天的 "view" 陣列中，景點數量必須**絕對嚴格符合**使用者選擇的節奏：**<用戶選擇的每日景點數量範圍，例如 5-6> 個景點之間**。
    * 第一天與最後一天景點數量至少是使用者偏好數量的一半（扣除搭飛機），例如 **<用戶選擇的每日景點數量範圍，例如 5-6> 即 2-3 個景點之間**

4.  **元件組合：絕對禁止複製與數據強制重組**
    * **絕對禁止：** 你的任務是**完全客製化**，**絕對禁止**複製任何單一行程的完整 Day 或連續兩組以上的景點序列。
    * **數據來源：** 景點的數據**必須**從知識庫的**元件級別**中獲取，並進行重組。

請嚴格按照以下 JSON 格式輸出詳細行程：
{
  "name": "行程名稱",
  "warning": "條件調整的建議說明，例如：預算不足、天數過少等，無法成團",
  "reminder": "注意事項說明文字，例如：注意寒冷、注意防曬、注意治安等",
  "daily": [
    {
      "day": 1,
      "breakfast": "餐食安排 (從 RAG 知識庫中選取)",
      "lunch": "餐食安排 (從 RAG 知識庫中選取)",
      "dinner": "餐食安排 (從 RAG 知識庫中選取)",
      "view": [
        {
          "view_id": "ITINERARY_VIEW_DB 中的景點 ID",
          "view_title": "景點名稱",
          "lat": 0.000000, // 必須被實際查詢到的浮點數替換
          "lng": 0.000000, // 必須被實際查詢到的浮點數替換
        },
      ],
      "hotel": {
        "data": [
          { "name": "住宿飯店名稱，區域需要同當日最後行程 (從 RAG 知識庫中選取)" }
        ]
      }
    }
  ]
}`;

const preamble_view = `
你是一個數據處理助手，你的任務是**嚴格地**將景點 ID 與 ITINERARY_VIEW_DB 知識庫中的資料匹配。

【必須遵循的原則】
1.  **數值要求 (絕對強制)**：lat 和 lng 欄位**必須輸出有效的浮點數**。**絕不能輸出 0、null 或空字串**。
2.  **數據來源**：必須到 ITINERARY_VIEW_DB 知識庫中查找景點 ID 對應的 view_content, lat, 和 lng。
3.  **替代機制**：如果知識庫中找不到資料，或者資料庫中的值是 null，**AI 必須**利用自身知識或該景點的城市中心座標來**合成一個合理的浮點數**來填充。
4.  **輸出語言**：所有 view_content 必須使用繁體中文回覆。

請嚴格按照以下 JSON 格式輸出：
`;

const viewExample = `
[
  {
    view_id: 'VJPNKUM08',
    view_title: '熊本城【日本三大名城之一】',
     view_content: '該景點的描述文字', // 模型會用查詢結果替換
     lat: 0.000000, // ✅ 必須是數字佔位符
     lng: 0.000000, // ✅ 必須是數字佔位符
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
