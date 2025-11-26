// @ts-nocheck
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class AiService {
  private rawBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  private jsonString = Buffer.from(this.rawBase64, 'base64').toString('utf8');
  private json = JSON.parse(this.jsonString);
  private cleanedCredentials = {
    ...this.json,
    private_key: this.json.private_key.replace(/\\n/g, '\n'),
  };

  async ai(text: string): Promise<any> {
    console.log('🤖 開始呼叫 Google Discovery Engine AI...');
    console.log('📝 查詢文字:', text);

    try {
      const auth = new GoogleAuth({
        credentials: this.cleanedCredentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });

      const client = await auth.getClient();
      const accessTokenResponse = await client.getAccessToken();
      const accessToken = accessTokenResponse.token;

      console.log('🔑 已取得 access token');

      // ✅ 使用正確的專案 ID (從你的測試結果得知)
      const targetProjectId = '1021738825143'; // 引擎所在的專案
      const engineId = 'besttour-ai_1763610243679';

      const url = `https://discoveryengine.googleapis.com/v1alpha/projects/${targetProjectId}/locations/global/collections/default_collection/engines/${engineId}/servingConfigs/default_search:answer`;

      // ✅ 完整的 API 請求 body
      const body = {
        query: {
          text: text,
        },
        relatedQuestionsSpec: {
          enable: true,
        },
        answerGenerationSpec: {
          ignoreAdversarialQuery: false,
          ignoreNonAnswerSeekingQuery: false,
          ignoreLowRelevantContent: false,
          multimodalSpec: {},
          includeCitations: true,
          promptSpec: {
            preamble: `你是一位擁有 10 年經驗的頂級旅遊產品經理。

                        你的任務是根據使用者需求，**嚴格複製**知識庫中檢索到的 **[行程模板] 的風格、節奏與餐飲等級**，並生成一個精簡、高品質的行程大綱。

                        【必須遵循的四大原則】

                        1.  **風格與文案複製：** 必須模仿原始模板的風格，優先保留 **Day 1/Day 5 的交通文案** 及 **特殊餐飲安排**。
                        2.  **地理邏輯：** 在生成過程中，**你必須使用景點和飯店的 \`city\` 和 \`lat/lng\` 資訊進行內部推理**，整趟行程避免繞到重覆城市。這些地理資訊 **嚴禁** 輸出到最終 JSON 中。
                        3.  **元件使用規範：** **嚴格使用** 從你的四個知識庫 (tour, view, hotel, food) 中檢索到的元件來構建行程。
                        4.  **輸出結構精簡化：** 最終回覆必須是一個**有效的 JSON 格式**，**精確模仿** 以下精簡後的結構。
                        5.  **飯店選項**：請列出三個飯店選項。

                        請嚴格按照以下 JSON 格式，不可缺少任何欄位，並輸出詳細行程：
                        {
                        "name": "行程名稱",
                        "warning": "條件調整的建議說明，例如：預算不足、天數過少等，無法成團",
                        "reminder": "注意事項說明文字，例如：注意寒冷、注意防曬、注意治安等",
                        "daily": [
                          {
                            "day": "1",
                            "breakfast": "餐食安排 (從 RAG 知識庫中選取)",
                            "lunch": "餐食安排 (從 RAG 知識庫中選取)",
                            "dinner": "餐食安排 (從 RAG 知識庫中選取)",
                            "abstract_2": [
                              { "name": "景點名稱【特色說明】 (從 RAG 知識庫中選取)" }
                            ],
                            "hotel": {
                              "data": [
                                { "name": "住宿飯店名稱，區域需要同當日最後行程 (從 RAG 知識庫中選取)" }
                              ]
                            }
                          }
                        ]
                        }`,
          },
          modelSpec: {
            modelVersion: 'stable',
          },
        },
      };

      console.log('📡 準備發送 Discovery Engine API 請求...');
      console.log('🎯 目標引擎:', engineId);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('🌐 API 回應狀態:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 請求失敗:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        return {
          success: false,
          error: `API 請求失敗: ${response.status} ${response.statusText}`,
          details: errorText,
        };
      }

      const result = await response.json();

      console.log('✅ API 請求成功！');
      console.log('📊 回應狀態:', result.answer?.state || 'unknown');

      // ✅ 處理回應資料
      const processedResult = this.processApiResponse(result, text);

      console.log('🎉 AI 回應處理完成');
      return processedResult;
    } catch (error) {
      console.error('❌ AI Service 錯誤:', error);
      return {
        success: false,
        error: error.message,
        troubleshooting: [
          '1. 檢查網路連線',
          '2. 確認 API 權限',
          '3. 檢查引擎狀態',
        ],
      };
    }
  }

  // @ts-nocheck
  // 修改 processApiResponse 方法
  private processApiResponse(apiResponse: any, originalQuery: string) {
    try {
      const answer = apiResponse.answer?.answerText || '';
      const state = apiResponse.answer?.state || 'UNKNOWN';
      const citations = apiResponse.answer?.citations || [];
      const relatedQuestions = apiResponse.relatedQuestions || [];

      console.log('📝 回答長度:', answer.length);
      console.log('📚 引用來源數量:', citations.length);
      console.log('❓ 相關問題數量:', relatedQuestions.length);

      // ✅ 嘗試解析 JSON 格式的回答
      let parsedAnswer = null;
      let finalJson = null; // ✅ 新增：最終的 JSON 回傳

      try {
        let cleanAnswer = answer.trim();

        // 清理 Markdown 包裝
        if (cleanAnswer.startsWith('```json') && cleanAnswer.endsWith('```')) {
          cleanAnswer = cleanAnswer
            .replace(/^```json\n/, '')
            .replace(/\n```$/, '');
        } else if (
          cleanAnswer.startsWith('```') &&
          cleanAnswer.endsWith('```')
        ) {
          cleanAnswer = cleanAnswer.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        if (cleanAnswer.startsWith('{') && cleanAnswer.endsWith('}')) {
          parsedAnswer = JSON.parse(cleanAnswer);
          finalJson = parsedAnswer; // ✅ 使用解析成功的 JSON
          console.log('✅ 成功解析為 JSON 格式');
        } else {
          // ✅ 如果不是 JSON 格式，包裝成 JSON
          finalJson = {
            type: 'text_response',
            content: cleanAnswer,
            note: '此回應不是標準的行程 JSON 格式',
          };
          console.log('⚠️ 回答不是 JSON 格式，已包裝為 JSON 物件');
        }
      } catch (jsonError) {
        console.log('⚠️ JSON 解析失敗，建立預設 JSON 結構');
        // ✅ 解析失敗時，建立預設結構
        finalJson = {
          type: 'error_response',
          content: answer,
          error: 'JSON 格式解析失敗',
          note: '原始回應內容保存在 content 欄位中',
        };
      }

      return {
        success: true,
        query: originalQuery,
        answer: {
          json: finalJson, // ✅ 改為 json 欄位，而非 text
          // parsed: parsedAnswer, // 保留原本的 parsed（可能為 null）
          // state: state,
          // originalText: answer, // ✅ 保留原始文字（以防需要）
        },
        // citations: citations.map((citation) => ({
        //   source: citation.source || '',
        //   title: citation.title || '',
        //   snippet: citation.snippet || '',
        // })),
        // relatedQuestions: relatedQuestions.map((q) => q.question || ''),
        // metadata: {
        //   timestamp: new Date().toISOString(),
        //   responseTime: Date.now(),
        //   engine: 'besttour-ai_1763610243679',
        //   dataFormat: parsedAnswer ? 'structured_json' : 'wrapped_json', // ✅ 標示資料格式
        // },
      };
    } catch (error) {
      console.error('❌ 處理 API 回應時發生錯誤:', error);
      return {
        success: false,
        error: '回應處理失敗',
        answer: {
          json: {
            type: 'processing_error',
            error: error.message,
            note: '回應處理過程中發生錯誤',
          },
        },
        rawResponse: apiResponse,
      };
    }
  }

  // ✅ 測試連線方法
  async testConnection(): Promise<any> {
    try {
      console.log('🔧 測試 Discovery Engine 連線...');
      const testResult = await this.ai('測試連線，請回覆 hello world');
      return {
        success: true,
        message: 'Discovery Engine 連線正常',
        test: testResult.success,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Discovery Engine 連線失敗',
        error: error.message,
      };
    }
  }
}
