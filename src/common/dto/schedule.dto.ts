import { ApiPropertyOptional } from '@nestjs/swagger';
import { ViewDto } from './view.dto';
import { HotelDto } from './hotel.dto';

export class Abstract2Dto {
  @ApiPropertyOptional({ example: 'VJPNOSA17' })
  id?: string;

  @ApiPropertyOptional({ example: '✈關西空港．機場商店街／桃園國際機場' })
  name?: string;
}

export class ScheduleDto {
  @ApiPropertyOptional({ example: '1' })
  free?: string;

  @ApiPropertyOptional({ example: '1' })
  day?: string;

  @ApiPropertyOptional({ example: '12 11 2025' })
  date?: string;

  @ApiPropertyOptional()
  memo_1?: string;

  @ApiPropertyOptional()
  memo_2?: string;

  @ApiPropertyOptional()
  memo_3?: string;

  @ApiPropertyOptional({ example: '溫暖的家' })
  breakfast?: string;

  @ApiPropertyOptional({ example: '機上餐食' })
  lunch?: string;

  @ApiPropertyOptional({ example: '方便逛街，敬請自理' })
  dinner?: string;

  @ApiPropertyOptional()
  abstract_1?: string;

  @ApiPropertyOptional({ type: [Abstract2Dto] })
  abstract_2?: Abstract2Dto[];

  @ApiPropertyOptional({ type: [ViewDto] })
  view?: ViewDto[];

  @ApiPropertyOptional({ type: [HotelDto] })
  hotel?: HotelDto[];

  @ApiPropertyOptional({ example: [''] })
  food?: string[];

  @ApiPropertyOptional({ example: '' })
  title?: string;

  @ApiPropertyOptional({ example: [''] })
  route?: string[];
}
