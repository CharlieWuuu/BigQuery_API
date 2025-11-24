import { ApiPropertyOptional } from '@nestjs/swagger';

export class HotelDto {
  @ApiPropertyOptional({ example: 'Urban Hotel京都五條Premium(附設大浴場)' })
  name?: string;

  @ApiPropertyOptional({ example: 'https://uh-urban.com/gojo/index.html' })
  url?: string;

  @ApiPropertyOptional({ example: '京都' })
  city?: string;

  @ApiPropertyOptional({ example: ['靠近市區', '乾淨即可'] })
  tags?: string[];

  @ApiPropertyOptional({ example: 34.997637 })
  lat?: number;

  @ApiPropertyOptional({ example: 135.759976 })
  lng?: number;
}

export class HotelArrayDto {
  @ApiPropertyOptional({ example: '1' })
  status?: string;

  @ApiPropertyOptional({ type: [HotelDto] })
  data?: HotelDto[];
}
