import { Module } from '@nestjs/common';
import { BigqueryService } from './bigquery.service';
import { BigqueryController } from './bigquery.controller';

@Module({
  controllers: [BigqueryController],
  providers: [BigqueryService],
})
export class BigqueryModule {}
