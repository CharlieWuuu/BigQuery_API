import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import type { GoogleCredentialJson } from 'src/common/type/googleCredential.type';

@Injectable()
export class AiService {
  private rawBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;
  private jsonString = Buffer.from(this.rawBase64, 'base64').toString('utf8');
  private credentialJson = JSON.parse(this.jsonString) as GoogleCredentialJson;
  // private private_key = this.json.private_key.replace(/\\n/g, '\n');
  // private credentialJson = { ...this.json, private_key: this.private_key };

  async ai(requirement: string, preamble: string): Promise<any> {
    console.log('🤖 開始呼叫 Google Discovery Engine AI，需求：', requirement);

    try {
      // 設定 Google Auth 並取得 Access Token
      console.log('🔐 設定 Google Auth 憑證');
      const auth = new GoogleAuth({
        credentials: this.credentialJson,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const client = await auth.getClient();
      const accessTokenResponse = await client.getAccessToken();
      const accessToken = accessTokenResponse.token;
      console.log('🔑 取得 access token');

      // 設定 Vertex AI Discovery Engine API 請求參數
      const targetProjectId = process.env.VERTEX_AI_PROJECT_ID; // 引擎所在的專案
      const engineId = process.env.VERTEX_AI_ENGINE_ID; // 引擎 ID
      const url = `https://discoveryengine.googleapis.com/v1alpha/projects/${targetProjectId}/locations/global/collections/default_collection/engines/${engineId}/servingConfigs/default_search:answer`;

      // Vertex AI API 請求 body
      const body = {
        query: { text: requirement },
        relatedQuestionsSpec: { enable: true },
        answerGenerationSpec: {
          ignoreAdversarialQuery: false,
          ignoreNonAnswerSeekingQuery: false,
          ignoreLowRelevantContent: false,
          multimodalSpec: {},
          includeCitations: true,
          promptSpec: { preamble: preamble },
          modelSpec: { modelVersion: 'stable' },
        },
      };

      // 發送 API 請求
      console.log('📡 準備發送 Discovery Engine API 請求...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log(result);
      console.log('🎉 AI 回應處理完成');
      return result;
    } catch (error) {
      console.error('❌ AI Service 錯誤:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async ai_tour(text: string): Promise<any> {
    await this.ai(text, '請你親切地回答我的問題');
    return '預計吐回 AI 產生的行程資料';
  }
}
