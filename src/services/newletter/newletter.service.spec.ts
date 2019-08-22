import { Test, TestingModule } from '@nestjs/testing';
import { NewletterService } from './newletter.service';

describe('NewletterService', () => {
  let service: NewletterService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewletterService],
    }).compile();
    service = module.get<NewletterService>(NewletterService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
