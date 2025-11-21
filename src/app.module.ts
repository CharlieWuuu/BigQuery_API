import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigqueryModule } from './bigquery/bigquery.module';
import { BigqueryController } from './bigquery/bigquery.controller';
import { BigqueryService } from './bigquery/bigquery.service';

@Module({
  imports: [BigqueryModule],
  controllers: [AppController, BigqueryController],
  providers: [AppService, BigqueryService],
})
export class AppModule {}
