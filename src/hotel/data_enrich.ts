require('dotenv').config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { HotelDto } from 'src/common/dto/hotel.dto';

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
function generatePrompt(data: HotelDto[], type: string): string {
  const textForAi = JSON.stringify(data, null, 2);

  const baseInstruction =
    '你是一位旅遊資料專家，請根據輸入的資料，以**繁體中文**補足或修正以下欄位：';

  let tagsInstruction = '';
  if (type === 'hotel') {
    tagsInstruction =
      '- tags 欄位，請補足個相關標籤，請使用以下選項，不得自行新增：' +
      '住宿偏好：經濟實惠、乾淨即可、溫泉旅館、國際五星級、靠近市區、特色民宿、渡假村、Villa。數量不限' +
      '- lat (緯度)、lng (經度) 欄位，請用 AI 生成經緯度至小數點後六位；' +
      '- city (城市名稱) 欄位，請用 AI 更正城市名稱，例如原本寫大阪但實際位置在京都，請修正為京都；請去除國家名稱，只保留城市名稱；請標示一級行政區，例如：大阪，不要「堺市」；無法判斷請空白';
  }

  const systemInstruction =
    baseInstruction +
    tagsInstruction +
    '請直接回傳 JSON 陣列格式，可以用 ```json 包裝。' +
    '未要求補足的欄位請保持原樣，不要更動。';

  return `${systemInstruction}\n請補足/修正以下飯店資料：\n${textForAi}`;
}

// 呼叫 Gemini API（用套件）
async function callGeminiAPI(
  data: HotelDto[],
  type: string,
): Promise<HotelDto[]> {
  console.log('\n--- 呼叫 Gemini API ---');
  const originalData = [...data]; // 備份原資料

  try {
    const prompt = generatePrompt(data, type);
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
    const enrichedData = JSON.parse(jsonText) as HotelDto[];

    return enrichedData;
  } catch (e) {
    console.warn(`[API 呼叫失敗] 批次: ${e}`);

    // 失敗時回傳原資料（可選：加上一些 mock 資料）
    return originalData.map((item) => ({
      ...item,
      lat: item.lat || 0,
      lng: item.lng || 0,
      city: item.city || 'AI補城市',
      tags: item.tags || ['經濟實惠'],
    }));
  }
}

// enrich 批次
async function enrichBatchWithGemini(
  batch: HotelDto[],
  type: string,
): Promise<HotelDto[]> {
  try {
    const enriched = await callGeminiAPI(batch, type);
    return enriched;
  } catch (e) {
    console.warn(`[批次處理失敗] ${e}`);
    return batch; // 回傳原資料
  }
}

// 主流程（處理傳入的資料）
export async function dataEnrich(data: HotelDto[]): Promise<HotelDto[]> {
  console.log('\n--- 飯店資料補足 ---');
  const batchSize = 15;

  let hotelEnriched: HotelDto[] = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    console.log(
      `[${i + 1}/${data.length}] 飯店 name=${batch[0]?.name || ''}, city=${batch[0]?.city || ''}`,
    );

    const enriched = await enrichBatchWithGemini(batch, 'hotel');
    hotelEnriched = hotelEnriched.concat(enriched);

    // 間隔 5 秒（避免 API 限制）
    if (i + batchSize < data.length) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log('\n--- AI補足完成 ---');
  return hotelEnriched;
}
