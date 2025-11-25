import { Injectable } from '@nestjs/common';
import { QuerylistDto } from './common/dto/querylist.dto';
import { ViewDto } from './common/dto/view.dto';
import type { ScheduleSplitDto } from 'src/common/type/schedule.type';
import { HotelDto } from './common/dto/hotel.dto';
import { FoodDto } from './common/dto/food.dto';

const data = [
  {
    name: '【特別企劃‧四國相撲５日】雷歐瑪森之湯、小豆島觀景纜車、大步危遊船、道後溫泉散策',
    id: '5534',
    price: '45900',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
    city: '日本 松山',
    slogan: '',
    day: '5',
    travel: [{ date: '12/10', travel_no: 'TAK05CI251210A', price: '45900' }],
  },
  {
    name: '【特惠輕旅大阪５日】日本環球影城、京都清水寺、大阪城公園、下鴨神社、錦市場、黑毛和牛',
    id: '27449',
    price: '21800',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/27449.jpg',
    city: '日本 京都',
    slogan: '',
    day: '5',
    travel: [
      { date: '12/14', travel_no: 'OSA05VZ251214Z', price: '21800' },
      { date: '01/03', travel_no: 'OSA05VZ260103Z', price: '25800' },
      { date: '01/06', travel_no: 'OSA05VZ260106Z', price: '26800' },
      { date: '01/10', travel_no: 'OSA05VZ260110Z', price: '27800' },
      { date: '01/13', travel_no: 'OSA05VZ260113Z', price: '26800' },
      { date: '01/17', travel_no: 'OSA05VZ260117Z', price: '27800' },
    ],
  },
  {
    name: '【特選捷克波蘭１０日】維利奇卡鹽礦、布拉格城堡區、遊船、華沙、克拉克夫、OUTLET',
    id: '26605',
    price: '64800',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/26605.jpg',
    city: '歐洲 捷克',
    slogan: '東歐',
    day: '10',
    travel: [
      { date: '01/13', travel_no: 'CZV10CA260113W', price: '64800' },
      { date: '01/27', travel_no: 'CZV10CA260127W', price: '64800' },
      { date: '02/24', travel_no: 'CZV10CA260224W', price: '64800' },
      { date: '03/17', travel_no: 'CZV10CA260317W', price: '64800' },
      { date: '03/24', travel_no: 'CZV10CA260324W', price: '64800' },
    ],
  },
];

@Injectable()
export class AppService {
  async updateData(): Promise<string> {
    // 1. /schedule GET query_list
    // 等太久暫時用假資料

    // 2. /schedule POST query_list，每個 list 打 API 取得 schedule，嵌入 query_list 並且回傳
    const res = await fetch('http://localhost:3000/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = (await res.json()) as QuerylistDto[];

    // 3. /schedule POST query_list_with_schedule，回傳 view, hotel, food, schedule_cleared

    const res_split = await fetch('http://localhost:3000/schedule/splitData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
    const rawData = (await res_split.json()) as ScheduleSplitDto;
    console.log('Raw data received:', rawData);

    // 4. /view POST view，回傳利用 AI enriched 後的 view 資料
    const res_view = await fetch('http://localhost:3000/view/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawData.view),
    });
    const enrichedViews = (await res_view.json()) as ViewDto[];
    console.log('Enriched views received:', enrichedViews);

    // 5. /hotel POST hotel，回傳利用 AI enriched 後的 hotel 資料
    const res_hotel = await fetch('http://localhost:3000/hotel/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawData.hotel),
    });
    const enrichedHotels = (await res_hotel.json()) as HotelDto[];
    console.log('Enriched hotels received:', enrichedHotels);

    // 6. /food POST food，回傳利用 AI enriched 後的 food 資料
    const res_food = await fetch('http://localhost:3000/food/enrich', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawData.food),
    });
    const enrichedFoods = (await res_food.json()) as FoodDto[];
    console.log('Enriched foods received:', enrichedFoods);

    // 7. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
    // 8. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
    // 9. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
    // 10. /bigquery POST view, hotel, food, schedule_cleared 到 BigQuery，回傳 OK or Error
    return '資料已更新';
  }
}
