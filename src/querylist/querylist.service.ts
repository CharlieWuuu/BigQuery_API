import { Injectable } from '@nestjs/common';
import { QueryListNew } from 'src/common/type/schedule.type';

@Injectable()
export class QuerylistService {
  async get(pageid: number) {
    try {
      const res = await fetch(
        `https://travelapi.besttour.com.tw/api/query_List_new.asp?pageid=${pageid}&pagesize=1`,
      );

      let text = await res.text();

      // 移除非法控制字元（保留正常的 \r \n \t）
      text = text
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

      try {
        const parsed = JSON.parse(text) as QueryListNew;
        return parsed;
      } catch (e) {
        console.error('取得 query_list 失敗:', e);
        throw e;
      }
    } catch (error) {
      console.error('取得 query_list 失敗:', error);
      throw error;
    }
  }
}
