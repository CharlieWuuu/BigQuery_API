import { Controller, Post, Body, Get } from '@nestjs/common';
import { ViewService } from './view.service';
import { ApiOperation } from '@nestjs/swagger';
import { ViewDto } from 'src/common/dto/view.dto';

// const rowData = [
//   {
//     id: 'VJPNKGW67',
//     name: '小豆島天使之路',
//     raw_name: '戀人聖地～小豆島天使之路',
//     description:
//       '小豆島天使之路是備受情侶歡迎的景點。與心愛之人攜手走過小豆島的天使之路，可以一生相伴，天長地久。延綿500米的沙洲，只有在一天兩次的退潮期間才會出現。沙洲出現後，形成了一條連接各個小島的黃金通道。據說手牽手走過天使之路登上與島的戀人，都會擁有美滿甜 蜜的愛情。',
//     city: '日本 松山',
//     tags: [],
//     lat: 0,
//     lng: 0,
//   },
//   {
//     id: 'VJPNKGW42',
//     name: '相撲巡迴表演大賽',
//     raw_name: '相撲巡迴表演大賽',
//     description:
//       '2025年香川大相撲比賽開催決定！<br/><br/>一年一度令人期待的「香川大相撲比賽」將於2025年12月13日（星期六），隆重登 場！<br/>這場比賽匯聚來自全國的頂尖力士，在傳統與熱情交織的土俵上激烈對決，展現日本國技的獨特魅力。現場不僅能感受到力士們的震撼氣勢，還有豐富的相撲周邊商品，適合全家大小一同參與。保證有票，不必再為搶票煩惱，快來親眼見證力士在土俵上的激烈對決吧！',
//     city: '日本 松山',
//     tags: [],
//     lat: 0,
//     lng: 0,
//   },
//   {
//     id: 'VJPNKGW02',
//     name: '金刀比羅宮',
//     raw_name: '海之守護神～金刀比羅宮',
//     description:
//       '因供奉著被稱為「金羅」的海上守護神而聞名，是健康、除災避禍、帶來好運的神明，因此自古以來一直香火興盛，位於象頭山 山腰上的金刀比羅宮，參拜道路極長，到象頭山山腰的正宮為785級石階，站在正宮前可一覽贊岐平原，在寶物館內收藏著11面觀音等寶物，另外在學藝參考館，展出由信徒們捐獻和奉納的各種工藝美術品。',
//     city: '日本 松山',
//     tags: [],
//     lat: 0,
//     lng: 0,
//   },
// ];

// const insertData = [
//   {
//     id: 'VJPNKGW67_test',
//     name: '小豆島天使之路',
//     raw_name: '戀人聖地～小豆島天使之路',
//     description:
//       '小豆島天使之路是備受情侶歡迎的景點。與心愛之人攜手走過小豆島的天使之路，可以一生相伴，天長地久。延綿500米的沙洲，只有在一天兩次的退潮期間才會出現。沙洲出現後，形成了一條連接各個小島的黃金通道。據說手牽手走過天使之路登上與島的戀人，都會擁有美滿甜 蜜的愛情。',
//     city: '香川',
//     tags: ['放鬆度假'],
//     lat: 34.475043,
//     lng: 134.195328,
//   },
//   {
//     id: 'VJPNKGW42',
//     name: '相撲巡迴表演大賽',
//     raw_name: '相撲巡迴表演大賽',
//     description:
//       '2025年香川大相撲比賽開催決定！<br/><br/>一年一度令人期待的「香川大相撲比賽」將於2025年12月13日（星期六），隆重登 場！<br/>這場比賽匯聚來自全國的頂尖力士，在傳統與熱情交織的土俵上激烈對決，展現日本國技的獨特魅力。現場不僅能感受到力士們的震撼氣勢，還有豐富的相撲周邊商品，適合全家大小一同參與。保證有票，不必再為搶票煩惱，快來親眼見證力士在土俵上的激烈對決吧！',
//     city: '高松',
//     tags: ['歷史文化', '親子同樂'],
//     lat: 34.351475,
//     lng: 134.048092,
//   },
//   {
//     id: 'VJPNKGW02',
//     name: '金刀比羅宮',
//     raw_name: '海之守護神～金刀比羅宮',
//     description:
//       '因供奉著被稱為「金羅」的海上守護神而聞名，是健康、除災避禍、帶來好運的神明，因此自古以來一直香火興盛，位於象頭山 山腰上的金刀比羅宮，參拜道路極長，到象頭山山腰的正宮為785級石階，站在正宮前可一覽贊岐平原，在寶物館內收藏著11面觀音等寶物，另外在學藝參考館，展出由信徒們捐獻和奉納的各種工藝美術品。',
//     city: '香川',
//     tags: ['歷史文化'],
//     lat: 34.204077,
//     lng: 133.8043,
//   },
// ];

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '查詢 BigQuery 資料' })
  get() {
    return '開發中...';
  }

  @Post('/enrich')
  @ApiOperation({ summary: '✅ 以 AI 補足資料細節' })
  async enrich(@Body() body?: { data?: ViewDto[] }): Promise<ViewDto[]> {
    console.log('Received data for enrichment:', body?.data?.[0]);
    if (!body?.data || body.data.length === 0) {
      console.log('⚠️ 沒有傳入景點資料，回傳空陣列');
      return [];
    }

    return this.viewService.enrich(body.data);
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  async merge(@Body() body: { data: ViewDto[] }) {
    console.log('Received data for BigQuery merge:', body);
    if (!body?.data || body.data.length === 0) {
      console.log('⚠️ 沒有傳入景點資料，使用測試資料');
      return this.viewService.merge([]); // 手動測試時使用假資料
    }

    console.log('✅ 使用真實資料上傳到 BigQuery');
    return this.viewService.merge(body.data);
  }
}
