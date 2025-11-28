import { Controller, Post, Body, Get } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { HotelDto } from 'src/common/dto/hotel.dto';
import { dataEnrich } from 'src/common/utils/data_enrich';

const rawData: HotelDto[] = [
  {
    name: '烏丸京都飯店',
    url: 'https://www.hotel.kyoto/karasuma/?doing_wp_cron=1668500345.7645380496978759765625',
    city: '',
    tags: [],
    lat: 0,
    lng: 0,
  },
];

const insertData = [
  {
    name: '烏丸京都飯店',
    url: 'https://www.hotel.kyoto/karasuma/?doing_wp_cron=1668500345.7645380496978759765625',
    city: '京都',
    tags: ['乾淨即可', '靠近市區'],
    lat: 34.99616,
    lng: 135.75924,
  },
];

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '⛔ 查詢 BigQuery 資料' })
  get() {
    return '開發中...';
  }

  @Post('/enrich')
  @ApiOperation({ summary: '✅ 以 AI 補足資料細節' })
  @ApiBody({
    description: `請貼上飯店資料 JSON：`,
    examples: {
      example1: { summary: '測試用行程資料', value: { data: rawData } },
    },
  })
  async enrich(@Body() body: { data: HotelDto[] }): Promise<HotelDto[]> {
    console.log('✅ 以 AI 補足資料細節', body.data.length);
    return dataEnrich(body.data, 'hotel');
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  @ApiBody({
    description: `請貼上飯店資料 JSON：`,
    examples: {
      example1: { summary: '測試用行程資料', value: { data: insertData } },
    },
  })
  async merge(@Body() body: { data: HotelDto[] }) {
    console.log('✅ 開始上傳資料到 BigQuery');
    return this.hotelService.merge(body.data);
  }
}
