import { PartialType } from '@nestjs/swagger';
import { CreateBigqueryDto } from './create-bigquery.dto';

export class UpdateBigqueryDto extends PartialType(CreateBigqueryDto) {}
