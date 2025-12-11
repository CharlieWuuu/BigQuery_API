import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule as MyScheduleModule } from './schedule/schedule.module';
import { ViewModule } from './view/view.module';
import { QuerylistModule } from './querylist/querylist.module';
import { QuerylistService } from './querylist/querylist.service';
import { AiModule } from './ai/ai.module';
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ViewService } from './view/view.service';

@Module({
  imports: [
    ViewModule,
    MyScheduleModule,
    QuerylistModule,
    AiModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController], // 只留 AppController
  providers: [AppService, QuerylistService, ScheduleService, ViewService], // 只留 AppService
})
export class AppModule {}
