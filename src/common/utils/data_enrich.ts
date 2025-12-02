import { config } from 'dotenv';

// 載入環境變數
config();

// 定義 AI 回應介面
interface AiResponse {
  code: string;
  msg: string;
  data: { text: string };
}

// 從 markdown 中提取 JSON
function extractJsonFromMarkdown(text: string): string {
  const match = text.match(/```json\s*(\[.*\]|\{.*\})\s*```/s);
  if (match) return match[1];
  return text.trim();
}

// 生成 prompt
function generatePrompt<T>(data: T[], type: string): string {
  // 將 JSON 轉換為字串
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

  if (type === 'food') {
    tagsInstruction =
      '- city (城市名稱) 欄位，請用 AI 更正城市名稱，例如原本寫大阪但實際位置在京都，請修正為京都；請去除國家名稱，只保留城市名稱；請標示一級行政區，例如：大阪，不要「堺市」；無法判斷請空白';
  }

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

  return `${systemInstruction}\n請補足/修正以下景點資料：\n${textForAi}`;
}

// 呼叫 AI - 處理一個批次
async function fetchAI<T>(batch: T[], type: string): Promise<T[]> {
  console.log(
    `[ common / utils / data_enrich ] 呼叫 Gemini API (批次大小: ${batch.length})`,
  );
  const originalData = [...batch]; // 備份原資料

  try {
    const prompt = generatePrompt(batch, type);
    console.log('[ common / utils / data_enrich ] 呼叫 Gemini API 開始...');

    // 用套件呼叫
    // NODE_TLS_REJECT_UNAUTHORIZED="0"
    const result = await fetch(process.env.HSIHUNG_API_AI as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: prompt }),
    });
    const response = (await result.json()) as AiResponse;
    const text = response.data.text;
    console.log(`[ common / utils / data_enrich ] Gemini 已回傳`);

    // 解析 JSON
    const jsonText = extractJsonFromMarkdown(text);
    const enrichedData = JSON.parse(jsonText) as T[];

    return enrichedData;
  } catch (e) {
    console.warn(`[ common / utils / data_enrich ] API 呼叫失敗，批次: ${e}`);
    return originalData; // 失敗時回傳原資料
  }
}

// 主流程（處理傳入的資料）
export async function dataEnrich<T>(data: T[], type: string): Promise<T[]> {
  console.log(
    `[ common / utils / data_enrich ] 景點資料補足 (總數: ${data.length})`,
    data,
  );
  const batchSize = 15;

  // 如果資料量小於等於 batchSize，直接處理
  if (data.length <= batchSize) {
    console.log(
      `[ common / utils / data_enrich ] 資料量 ${data.length} 筆，直接處理`,
    );
    return await fetchAI(data, type);
  }

  // 如果資料量大，分批處理
  console.log(
    `[ common / utils / data_enrich ] 資料量 ${data.length} 筆，需要分批處理 (每批 ${batchSize} 筆)`,
  );
  let viewEnriched: T[] = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    console.log(
      `[${Math.floor(i / batchSize) + 1}/${Math.ceil(data.length / batchSize)}] 處理第 ${i + 1}-${Math.min(i + batchSize, data.length)} 筆`,
    );

    const enriched = await fetchAI(batch, type);
    viewEnriched = viewEnriched.concat(enriched);

    // 間隔 1 秒（避免 API 限制），最後一批不需要等待
    if (i + batchSize < data.length) {
      console.log('等待 1 秒...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`[ common / utils / data_enrich ]  AI補足完成`);
  return viewEnriched;
}
