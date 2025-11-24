import { Injectable } from '@nestjs/common';
// import { CreateQuerylistDto } from './querylist/dto/create-querylist.dto';

@Injectable()
export class AppService {
  updateData(): string {
    // const res = await fetch('/querylist');
    // const data = (await res.json()) as CreateQuerylistDto[];

    const data = [
      {
        name: '【特別企劃‧四國相撲５日】雷歐瑪森之湯、小豆島觀景纜車、大步危遊船、道後溫泉散策',
        id: '5534',
        price: '45900',
        img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
        city: '日本 松山',
        slogan: '',
        day: '5',
        travel: [
          { date: '12/10', travel_no: 'TAK05CI251210A', price: '45900' },
        ],
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

    console.log(data[0]);
    return '資料已更新';
  }
}
