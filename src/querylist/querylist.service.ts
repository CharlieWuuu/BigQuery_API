import { Injectable } from '@nestjs/common';
import { QueryListNew } from 'src/common/type/schedule.type';
import axios from 'axios';

export interface TravelArea {
  name: string;
  id: number;
  sub?: TravelArea[];
}

export interface FlyData {
  fly_no: string;
  fly_date: string;
  dep_city_code: string;
  arr_city_code: string;
  dep_tm: string;
  arr_tm: string;
  fly_line: string;
  dep_city: string;
  arr_city: string;
}

export interface SpecialIcon {
  icon_color: string;
  icon_name: string;
}

export interface ChildAge {
  child_age_10: number;
  child_age_11: number;
  child_age_20: number;
  child_age_21: number;
  INF_age: number;
}

export interface TravelDetail {
  pak_flag: string;
  group_id: number;
  travel_id: number;
  travel_no: string;
  travel_status: string;
  travel_day: number;
  travel_date: string;
  country: string;
  area: TravelArea[];
  takeoff_city: string;
  travel_image_url: string;
  keywords: string;
  travel_abstract: string;
  travel_city: string;
  price_adult: number;
  price_adult_agent: number;
  price_child: number;
  price_child_agent: number;
  price_child_2: number;
  price_child_agent_2: number;
  price_inf: number;
  price_inf_agent: number;
  price_single: number;
  pre_fee: number;
  visa_type: string;
  visa_fee: number;
  tax_fee: number;
  Y_class: number;
  order_person: number;
  unpay_person: number;
  RQ_person: number;
  tour_flag: string;
  fly_data: FlyData[];
  travel_title_1: string;
  travel_title_2: string;
  special_icon: SpecialIcon[];
  discount: any[]; // 若有明確型別可再細化
  child_age: ChildAge;
}

export interface Page {
  total_page: number;
  current_page: number;
  total: number;
}

export interface TourData {
  status: string;
  msg: string;
  data: TravelDetail[];
  page: Page;
}

function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

@Injectable()
export class QuerylistService {
  async get(pageid: number) {
    try {
      const res = await fetch(
        `https://travelapi.besttour.com.tw/api/query_List_new.asp?pageid=${pageid}&pagesize=3`,
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

  async tourData(page: number, page_count: number) {
    console.log(`查詢 Tour Data，頁碼：${page}，每頁筆數：${page_count}`);
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const halfYearLater = new Date(today);
    halfYearLater.setMonth(today.getMonth() + 7);

    const nextMonthStr = formatDate(nextMonth);
    const halfYearLaterStr = formatDate(halfYearLater);

    const getTourData = async () => {
      return await axios.request({
        method: 'GET',
        url: 'https://travelapi.besttour.com.tw/api/tour/v3/tourData/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'MzQwODA1LDIwMjUvMTIvMDEsJmRmMiotNQ==',
        },
        data: {
          date_start: nextMonthStr, // 出發日期：下個月
          date_end: halfYearLaterStr, // 出發日期：下個月的半年後
          takeoff_city: ['桃園', '松山', '台中', '高雄'], // 出發城市
          area: '12, 156', // 日本、泰國
          page: page,
          page_count: page_count,
        },
      });
    };

    try {
      const res = await getTourData();
      const data = res.data as TourData;
      // 提取所有 travel_id 並去除重複
      const travel_id_Arr = Array.from(
        new Set(data.data.map((item) => item.travel_id)),
      );
      console.log(`取得 ${travel_id_Arr.length} 筆 travel_id：`, travel_id_Arr);
      return { status: '00', msg: 'Success', data: travel_id_Arr };
    } catch (error) {
      return { status: '05', msg: (error as Error).message };
    }
  }
}
