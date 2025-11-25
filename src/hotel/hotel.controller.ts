import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiOperation } from '@nestjs/swagger';
import { HotelDto } from 'src/common/dto/hotel.dto';

const insertData = [
  {
    name: '烏丸京都飯店',
    url: 'https://www.hotel.kyoto/karasuma/?doing_wp_cron=1668500345.7645380496978759765625',
    city: '京都',
    tags: ['乾淨即可', '靠近市區'],
    lat: 34.99616,
    lng: 135.75924,
  },
  {
    name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
    url: 'https://grand-hotel.co.jp/shinsaibashi/',
    city: '大阪',
    tags: ['乾淨即可', '靠近市區'],
    lat: 34.67323,
    lng: 135.5028,
  },
  {
    name: '大阪新今宮知鄉標準酒店',
    url: 'https://www.solarehotels.com/hotel/osaka/cs-os/',
    city: '大阪',
    tags: ['經濟實惠', '乾淨即可', '靠近市區'],
    lat: 34.65345,
    lng: 135.50367,
  },
];

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '從 BigQuery 取得資料' })
  findAll() {
    return this.hotelService.findAll();
  }

  @Post('/enrich')
  @ApiOperation({ summary: '以 AI 補足資料細節' })
  // enrich(@Body() data: ViewDto[]) {
  enrich(): Promise<HotelDto[]> {
    const data: HotelDto[] = [
      {
        name: '烏丸京都飯店',
        url: 'https://www.hotel.kyoto/karasuma/?doing_wp_cron=1668500345.7645380496978759765625',
        city: '',
        tags: [],
        lat: 0,
        lng: 0,
      },
      {
        name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
        url: 'https://grand-hotel.co.jp/shinsaibashi/',
        city: '',
        tags: [],
        lat: 0,
        lng: 0,
      },
      {
        name: '大阪新今宮知鄉標準酒店',
        url: 'https://www.solarehotels.com/hotel/osaka/cs-os/',
        city: '',
        tags: [],
        lat: 0,
        lng: 0,
      },
    ];
    return this.hotelService.enrich(data);
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '上傳資料到 BigQuery' })
  async merge(@Body() body: { data: HotelDto[] }) {
    console.log('Received data for BigQuery merge:', body);
    if (body === undefined) {
      body = { data: insertData };
    }
    const result = await this.hotelService.merge(body.data);
    return result;
  }
}
