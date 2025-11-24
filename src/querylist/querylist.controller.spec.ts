import { Test, TestingModule } from '@nestjs/testing';
import { QuerylistController } from './querylist.controller';
import { QuerylistService } from './querylist.service';

describe('QuerylistController', () => {
  let controller: QuerylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuerylistController],
      providers: [QuerylistService],
    }).compile();

    controller = module.get<QuerylistController>(QuerylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
