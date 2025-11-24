import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
// import { ScheduleDto } from 'src/common/dto/schedule.dto';
import { ApiOperation } from '@nestjs/swagger';
import { QuerylistDto } from 'src/common/dto/querylist.dto';

const testData = [
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

let fullScheduleData: QuerylistDto[] = [];

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({
    summary:
      'POST query_list，每個 list 打 API 取得 schedule，嵌入 query_list 並且回傳',
  })
  async addScheduleToQueryList(@Body() data: QuerylistDto[]) {
    data = testData; // 測試的時候先用這個資料
    fullScheduleData = await this.scheduleService.addScheduleToQueryList(data);
    return fullScheduleData;
  }

  @Post('splitData')
  @ApiOperation({
    summary:
      'POST query_list_with_schedule，回傳 view, hotel, food, schedule_cleared',
  })
  splitData() {
    return this.scheduleService.splitData(fullScheduleData);
  }

  @Get('/bigquery')
  @ApiOperation({ summary: '從 BigQuery 取得 schedule' })
  findOne() {
    return this.scheduleService.findAll();
  }

  @Delete('/bigquery')
  @ApiOperation({ summary: '刪除 BigQuery 中的過期 schedule 資料' })
  remove() {
    return this.scheduleService.remove(0);
  }

  // TODO 1. /schedule GET query_list
  // TODO 2. /schedule POST query_list，每個 list 打 API 取得 schedule，嵌入 query_list 並且回傳
  // TODO 3. /schedule POST query_list_with_schedule，回傳 view, hotel, food, schedule_cleared
}
