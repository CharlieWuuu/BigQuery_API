import { Controller, Post, Body, Get } from '@nestjs/common';
import { ViewService } from './view.service';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { ViewDto } from 'src/common/dto/view.dto';
import { dataEnrich } from 'src/common/utils/data_enrich';

const rowData = [
  {
    id: 'VJPNKGW67_test',
    name: '小豆島天使之路',
    raw_name: '戀人聖地～小豆島天使之路',
    description:
      '小豆島天使之路是備受情侶歡迎的景點。與心愛之人攜手走過小豆島的天使之路，可以一生相伴，天長地久。延綿500米的沙洲，只有在一天兩次的退潮期間才會出現。沙洲出現後，形成了一條連接各個小島的黃金通道。據說手牽手走過天使之路登上與島的戀人，都會擁有美滿甜 蜜的愛情。',
    city: '香川',
    tags: [],
    lat: 0,
    lng: 0,
  },
];

const insertData = [
  {
    id: 'VJPNKGW67_test',
    name: '小豆島天使之路',
    raw_name: '戀人聖地～小豆島天使之路',
    description:
      '小豆島天使之路是備受情侶歡迎的景點。與心愛之人攜手走過小豆島的天使之路，可以一生相伴，天長地久。延綿500米的沙洲，只有在一天兩次的退潮期間才會出現。沙洲出現後，形成了一條連接各個小島的黃金通道。據說手牽手走過天使之路登上與島的戀人，都會擁有美滿甜 蜜的愛情。',
    city: '香川',
    tags: ['放鬆度假'],
    lat: 34.475043,
    lng: 134.195328,
  },
];

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '⛔ 查詢 BigQuery 資料' })
  get() {
    return '開發中...';
  }

  @Post('/enrich')
  @ApiOperation({ summary: '✅ 以 AI 補足資料細節' })
  @ApiBody({
    description: `請貼上景點資料 JSON：`,
    examples: {
      example1: { summary: '測試用景點資料', value: { data: rowData } },
    },
  })
  async enrich(@Body() body: { data: ViewDto[] }): Promise<ViewDto[]> {
    console.log('✅ 以 AI 補足資料細節');
    return dataEnrich(body.data, 'view');
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  @ApiBody({
    description: `請貼上景點資料 JSON：`,
    examples: {
      example1: { summary: '測試用景點資料', value: { data: insertData } },
    },
  })
  async merge(@Body() body: { data: ViewDto[] }) {
    console.log('✅ 開始上傳資料到 BigQuery');
    return this.viewService.merge(body.data);
  }
}
