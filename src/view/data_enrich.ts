require('dotenv').config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ViewDto } from 'src/common/dto/view.dto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// 從 markdown 中提取 JSON
function extractJsonFromMarkdown(text: string): string {
  const match = text.match(/```json\s*(\[.*\]|\{.*\})\s*```/s);
  if (match) {
    return match[1];
  }
  return text.trim();
}

// 生成 prompt
function generatePrompt(data: ViewDto[], type: string): string {
  const textForAi = JSON.stringify(data, null, 2);

  const baseInstruction =
    '你是一位旅遊資料專家，請根據輸入的資料，以**繁體中文**補足或修正以下欄位：';

  let tagsInstruction = '';
  if (type === 'view') {
    tagsInstruction =
      '- tags 欄位，請補足個相關標籤，請使用以下選項，不得自行新增：' +
      '旅遊風格：放鬆度假、購物美食、歷史文化、親子同樂。數量不限' +
      '- lat (緯度)、lng (經度) 欄位，請用 AI 生成經緯度至小數點後六位；' +
      '- city (城市名稱) 欄位，請用 AI 更正城市名稱，例如原本寫大阪但實際位置在京都，請修正為京都；請去除國家名稱，只保留城市名稱；請標示一級行政區，例如：大阪，不要「堺市」；無法判斷請空白';
  }

  const systemInstruction =
    baseInstruction +
    tagsInstruction +
    '請直接回傳 JSON 陣列格式，可以用 ```json 包裝。' +
    '未要求補足的欄位請保持原樣，不要更動。';

  return `${systemInstruction}\n請補足/修正以下景點資料：\n${textForAi}`;
}

// 呼叫 Gemini API（用套件） - 處理一個批次
async function enrichBatchWithGemini(
  batch: ViewDto[],
  type: string,
): Promise<ViewDto[]> {
  console.log(`\n--- 呼叫 Gemini API (批次大小: ${batch.length}) ---`);
  const originalData = [...batch]; // 備份原資料

  try {
    const prompt = generatePrompt(batch, type);
    console.log('[呼叫 Gemini API] 開始...');

    // 用套件呼叫
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      console.warn('[API 回傳內容為空] 使用原資料');
      return originalData;
    }

    console.log(`[Gemini 回傳原始內容]:\n${text}`);

    // 解析 JSON
    const jsonText = extractJsonFromMarkdown(text);
    const enrichedData = JSON.parse(jsonText) as ViewDto[];

    // 確保回傳的陣列長度和輸入一致
    if (enrichedData.length !== batch.length) {
      console.warn(
        `[警告] API 回傳數量不符 (期望:${batch.length}, 實際:${enrichedData.length}), 使用原資料`,
      );
      return originalData;
    }

    return enrichedData;
  } catch (e) {
    console.warn(`[API 呼叫失敗] 批次: ${e}`);

    // 失敗時回傳原資料（可選：加上一些 mock 資料）
    return originalData.map((item) => ({
      ...item,
      lat: item.lat || 0,
      lng: item.lng || 0,
      city: item.city || 'AI補城市',
      tags: item.tags || ['放鬆度假'],
    }));
  }
}

// 主流程（處理傳入的資料）
export async function dataEnrich(data: ViewDto[]): Promise<ViewDto[]> {
  console.log(`\n--- 景點資料補足 (總數: ${data.length}) ---`);
  const batchSize = 15;

  // 如果資料量小於等於 batchSize，直接處理
  if (data.length <= batchSize) {
    console.log(`資料量 ${data.length} 筆，直接處理`);
    return await enrichBatchWithGemini(data, 'view');
  }

  // 如果資料量大，分批處理
  console.log(`資料量 ${data.length} 筆，需要分批處理 (每批 ${batchSize} 筆)`);
  let viewEnriched: ViewDto[] = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    console.log(
      `[${Math.floor(i / batchSize) + 1}/${Math.ceil(data.length / batchSize)}] 處理第 ${i + 1}-${Math.min(i + batchSize, data.length)} 筆`,
    );

    const enriched = await enrichBatchWithGemini(batch, 'view');
    viewEnriched = viewEnriched.concat(enriched);

    // 間隔 5 秒（避免 API 限制），最後一批不需要等待
    if (i + batchSize < data.length) {
      console.log('等待 5 秒...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log('\n--- AI補足完成 ---');
  return viewEnriched;
}
