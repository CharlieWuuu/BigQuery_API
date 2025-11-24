import { Injectable } from '@nestjs/common';
import { QuerylistDto } from 'src/common/dto/querylist.dto';

@Injectable()
export class QuerylistService {
  async findAll() {
    try {
      const res = await fetch('https://t1.besttour.com.tw/api/query_list.asp');
      console.log(res);
      let text = await res.text();
      console.log(text);

      // 移除非法控制字元（保留正常的 \r \n \t）
      text = text
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

      try {
        const parsed = JSON.parse(text) as {
          status: string;
          data: QuerylistDto[];
        };
        return parsed.data;
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
