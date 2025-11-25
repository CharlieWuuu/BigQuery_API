import { Injectable } from '@nestjs/common';
import { QuerylistDto } from 'src/common/dto/querylist.dto';
import { ScheduleDto } from 'src/common/dto/schedule.dto';
import { dataCleaner } from './data_cleaner';
import type { ScheduleSplitDto } from 'src/common/type/schedule.type';

@Injectable()
export class ScheduleService {
  async addScheduleToQueryList(data: QuerylistDto[]) {
    await Promise.all(
      data.map(async (item) => {
        console.log('Processing item:', item.travel?.[0]?.travel_no);
        const travel_no = item.travel?.[0]?.travel_no;
        const res = await fetch(
          `https://t1.besttour.com.tw/api/travel_detail_schedule.asp?travel_no=${travel_no}`,
        );
        const json = (await res.json()) as { data: ScheduleDto };
        const schedule = json.data as ScheduleDto[];
        item.schedule = schedule;
      }),
    );

    return data;
  }

  // 將 QuerylistDto 轉成 RawData
  splitData(fullScheduleData: QuerylistDto[]): ScheduleSplitDto {
    return dataCleaner(fullScheduleData);
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
