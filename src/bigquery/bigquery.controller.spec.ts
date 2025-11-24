import { Test, TestingModule } from '@nestjs/testing';
import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';

describe('BigqueryController', () => {
  let controller: BigqueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BigqueryController],
      providers: [BigqueryService],
    }).compile();

    controller = module.get<BigqueryController>(BigqueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
