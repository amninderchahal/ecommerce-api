import { Test, TestingModule } from '@nestjs/testing';
import { HashHelper } from './hash-helper';

describe('HashHelper', () => {
  let provider: HashHelper;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashHelper],
    }).compile();
    provider = module.get<HashHelper>(HashHelper);
  });
  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
