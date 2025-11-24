import { Injectable } from '@nestjs/common';
import { CreateBigqueryDto } from './dto/create-bigquery.dto';
import { UpdateBigqueryDto } from './dto/update-bigquery.dto';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigqueryService {
  create(createBigqueryDto: CreateBigqueryDto) {
    return 'This action adds a new bigquery';
  }

  findAll() {
    return `This action returns all bigquery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bigquery`;
  }

  update(id: number, updateBigqueryDto: UpdateBigqueryDto) {
    return `This action updates a #${id} bigquery`;
  }

  remove(id: number) {
    return `This action removes a #${id} bigquery`;
  }

  private bigquery = new BigQuery();

  async query(sql: string) {
    try {
      const [rows] = await this.bigquery.query({ query: sql });
      return rows as [];
    } catch (error) {
      console.error('BigQuery 查詢失敗:', error);
      throw error;
    }
  }

  async insert(table: string, rows: object[]) {
    try {
      // 支援 table 格式: dataset.table 或 project.dataset.table
      const parts = table.split('.');
      let datasetId: string;
      let tableId: string;

      if (parts.length === 2) {
        [datasetId, tableId] = parts;
      } else if (parts.length === 3) {
        [, datasetId, tableId] = parts;
      } else {
        throw new Error(
          'table 格式錯誤，請用 dataset.table 或 project.dataset.table',
        );
      }

      const result = await this.bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(rows);
      return { success: true, result };
    } catch (error) {
      console.error('BigQuery 插入失敗:', error);
      throw error;
    }
  }

  async insertView(rows: object[]) {
    return this.insert('Bestour_AI.TEST_VIEW_DB', rows);
  }

  async insertFood(rows: object[]) {
    return this.insert('Bestour_AI.TEST_FOOD_DB', rows);
  }

  async insertHotel(rows: object[]) {
    return this.insert('Bestour_AI.TEST_HOTEL_DB', rows);
  }

  async insertScheduleCleared(rows: object[]) {
    return this.insert('Bestour_AI.TEST_SCHEDULE_CLEARED_DB', rows);
  }
}
