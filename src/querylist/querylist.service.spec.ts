import { Test, TestingModule } from '@nestjs/testing';
import { QuerylistService } from './querylist.service';

describe('QuerylistService', () => {
  let service: QuerylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuerylistService],
    }).compile();

    service = module.get<QuerylistService>(QuerylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
