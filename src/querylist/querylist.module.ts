import { Module } from '@nestjs/common';
import { QuerylistService } from './querylist.service';
import { QuerylistController } from './querylist.controller';

@Module({
  controllers: [QuerylistController],
  providers: [QuerylistService],
})
export class QuerylistModule {}
