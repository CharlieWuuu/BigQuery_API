import { ApiPropertyOptional } from '@nestjs/swagger';

export class ViewDto {
  @ApiPropertyOptional({ example: 'VJPNOSA17' })
  id?: string;

  @ApiPropertyOptional({ example: '✈關西空港．機場商店街／桃園國際機場' })
  name?: string;

  @ApiPropertyOptional({
    example: 'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA17.jpg',
  })
  images?: string;

  @ApiPropertyOptional()
  memo_1?: string;

  @ApiPropertyOptional()
  memo_2?: string;

  @ApiPropertyOptional()
  memo_3?: string;

  @ApiPropertyOptional({ example: '✈關西空港．機場商店街／桃園國際機場' })
  raw_name?: string;

  @ApiPropertyOptional({
    example:
      '今天集合於桃園中正機場的團體櫃台，搭乘豪華客機飛往日本大城－〔大阪〕關西空港。',
  })
  description?: string;

  @ApiPropertyOptional({ example: '大阪' })
  city?: string;

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ example: 34.42721 })
  lat?: number;

  @ApiPropertyOptional({ example: 135.2443 })
  lng?: number;
}
