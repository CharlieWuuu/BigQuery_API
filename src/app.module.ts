import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigqueryModule } from './bigquery/bigquery.module';
import { BigqueryController } from './bigquery/bigquery.controller';

@Module({
  imports: [BigqueryModule],
  controllers: [AppController, BigqueryController],
  providers: [AppService],
})
export class AppModule {}
