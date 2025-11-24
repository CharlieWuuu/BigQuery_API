import { ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleDto } from './schedule.dto';

export class TravelDto {
  @ApiPropertyOptional({ example: '12/14' })
  date?: string;

  @ApiPropertyOptional({ example: 'OSA06BR251214BB' })
  travel_no?: string;

  @ApiPropertyOptional({ example: '33800' })
  price?: string;
}

export class QuerylistDto {
  @ApiPropertyOptional({
    example:
      '【心京都雙鐵道６日】日本環球影城、琵琶湖、茶街宇治、奈良小鹿、伏見稻荷、敘敘苑燒肉',
  })
  name?: string;

  @ApiPropertyOptional({ example: '27169' })
  id?: string;

  @ApiPropertyOptional({ example: '33800' })
  price?: string;

  @ApiPropertyOptional({
    example:
      'https://hsihung.ittms.com.tw/intranet/travel_list/images/27169.jpg',
  })
  img?: string;

  @ApiPropertyOptional({ example: '日本 京都' })
  city?: string;

  @ApiPropertyOptional({ example: '日本關西' })
  slogan?: string;

  @ApiPropertyOptional({ example: '6' })
  day?: string;

  @ApiPropertyOptional({ type: [TravelDto] })
  travel?: TravelDto[];

  @ApiPropertyOptional({ example: 'OSA06BR251214BB' })
  travel_no?: string;

  @ApiPropertyOptional({ type: [ScheduleDto] })
  schedule?: ScheduleDto[];

  @ApiPropertyOptional({ example: ['親子', '自由行'] })
  tags?: string[];
}
