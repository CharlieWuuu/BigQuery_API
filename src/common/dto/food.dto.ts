import { ApiPropertyOptional } from '@nestjs/swagger';

export class FoodDto {
  @ApiPropertyOptional({ example: '日式精緻餐盒+茶飲' })
  name?: string;
  @ApiPropertyOptional({ example: '日式精緻餐盒+茶飲' })
  raw_text?: string;
  @ApiPropertyOptional({ example: '' })
  city?: string;
  @ApiPropertyOptional({ example: 'breakfast' })
  type?: 'breakfast' | 'lunch' | 'dinner';
}
