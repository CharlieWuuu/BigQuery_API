import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigqueryService {
  private bigquery = new BigQuery();

  async query(sql: string) {
    const [rows] = await this.bigquery.query({ query: sql });
    return rows as [];
  }
}
