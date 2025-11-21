import { ApiPropertyOptional } from '@nestjs/swagger';

export class InsertRowDto {
  @ApiPropertyOptional({ example: 135.843478 })
  lat?: number;

  @ApiPropertyOptional({ example: 34.6847216 })
  lng?: number;

  @ApiPropertyOptional({ example: '奈良梅花鹿公園' })
  name?: string;

  @ApiPropertyOptional({ example: '與梅花鹿近距離互動的公園' })
  description?: string;

  @ApiPropertyOptional({ example: ['歷史文化'], type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ example: '紅葉名所◆奈良梅花鹿公園' })
  raw_name?: string;

  @ApiPropertyOptional({ example: '奈良' })
  city?: string;

  @ApiPropertyOptional({ example: 'UUID-TEST-001' })
  id?: string;
}

export class InsertBigQueryDto {
  @ApiPropertyOptional({
    example: 'custom-graph-328814.Bestour_AI.TEST_VIEW_DB',
  })
  table?: string;

  @ApiPropertyOptional({ type: [InsertRowDto] })
  rows?: InsertRowDto[];
}
