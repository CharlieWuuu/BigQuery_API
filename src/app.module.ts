import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigqueryModule } from './bigquery/bigquery.module';
import { HotelModule } from './hotel/hotel.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ViewModule } from './view/view.module';
import { QuerylistModule } from './querylist/querylist.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    BigqueryModule,
    ViewModule,
    HotelModule,
    ScheduleModule,
    QuerylistModule,
    AiModule,
  ],
  controllers: [AppController], // 只留 AppController
  providers: [AppService], // 只留 AppService
})
export class AppModule {}
