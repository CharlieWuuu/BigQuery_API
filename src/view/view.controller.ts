import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ViewService } from './view.service';
import { ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ViewDto } from 'src/common/dto/view.dto';
import { dataEnrich } from 'src/common/utils/data_enrich';

const rowData = [
  {
    view_id: 'VTHICNX16',
    view_title: '清邁雙龍寺 Wat Phra That Doi Suthep (含立式斜坡電梯纜車)',
    view_content:
      '位於素帖山國家公園金光閃閃的雙龍寺，我們將安排您搭乘纜車上山去，三百階梯免煩惱。雙龍寺也是泰國的一座上座部佛教寺廟，距離清邁市15公里，座落在海拔1053公尺的高山上，傳說有位錫蘭高僧帶了幾顆佛舍利到泰國，交由白象選址後人們就建了舍利塔，又由於山路兩旁有兩隻金龍守護，所以叫雙龍寺。',
    view_image:
      'https://hsihung.ittms.com.tw/intranet/view/images/VTHICNX16.jpg',
    view_memo:
      '※雙龍寺每逢週末及泰國假日，上山設有交通管制，遊覽車不能入園，如團體適逢該區間，則另安排改搭雙排車上山參觀，特此說明。\r\n※在泰國寺廟因宗教信仰入內參觀時皆會有相關服裝規定，如果您的儀容不符規定，則售票處提供沙龍租借，一次約20~50銖，將沙龍為上腰間，遮住下半身即可。',
    city: '',
    tags: [],
    lat: 0,
    lng: 0,
  },
];

const insertData = [
  {
    view_id: 'VTHICNX16',
    view_title: '清邁雙龍寺 Wat Phra That Doi Suthep (含立式斜坡電梯纜車)',
    view_content:
      '位於素帖山國家公園金光閃閃的雙龍寺，我們將安排您搭乘纜車上山去，三百階梯免煩惱。雙龍寺也是泰國的一座上座部佛教寺廟，距離清邁市15公里，座落在海拔1053公尺的高山上，傳說有位錫蘭高僧帶了幾顆佛舍利到泰國，交由白象選址後人們就建了舍利塔，又由於山路兩旁有兩隻金龍守護，所以叫雙龍寺。',
    view_image:
      'https://hsihung.ittms.com.tw/intranet/view/images/VTHICNX16.jpg',
    view_memo:
      '※雙龍寺每逢週末及泰國假日，上山設有交通管制，遊覽車不能入園，如團體適逢該區間，則另安排改搭雙排車上山參觀，特此說明。\r\n※在泰國寺廟因宗教信仰入內參觀時皆會有相關服裝規定，如果您的儀容不符規定，則售票處提供沙龍租借，一次約20~50銖，將沙龍為上腰間，遮住下半身即可。',
    city: '清邁',
    tags: ['歷史文化', '放鬆度假'],
    lat: 18.800167,
    lng: 98.906861,
  },
];

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get('/queryViewNotEnrichedId')
  @ApiOperation({ summary: '✅ 查詢所有的景點 ID' })
  async queryViewNotEnrichedId() {
    return this.viewService.queryViewNotEnrichedId();
  }

  @Get('/queryView')
  @ApiOperation({ summary: '✅ 查詢單一景點' })
  @ApiQuery({
    name: 'view_id',
    description: '景點 ID',
    required: true,
    type: String,
    example: 'VTHICNX16',
  })
  async queryView(@Query() { view_id }: { view_id: string }) {
    return this.viewService.queryView(view_id);
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

  // @Post('/bigquery')
  // @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  // @ApiBody({
  //   description: `請貼上景點資料 JSON：`,
  //   examples: {
  //     example1: { summary: '測試用景點資料', value: { data: insertData } },
  //   },
  // })
  // async merge(@Body() body: { data: ViewDto[] }) {
  //   console.log('✅ 開始上傳資料到 BigQuery');
  //   return this.viewService.merge(body.data);
  // }

  @Post('/itineraryBigquery')
  @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  @ApiBody({
    description: `請貼上景點資料 JSON：`,
    examples: {
      example1: { summary: '測試用景點資料', value: { data: insertData } },
    },
  })
  async mergeItinerary(@Body() body: { data: ViewDto[] }) {
    console.log('✅ 開始上傳資料到 BigQuery');
    return this.viewService.mergeItinerary(body.data);
  }
}
