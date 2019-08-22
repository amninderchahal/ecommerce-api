import { Test, TestingModule } from '@nestjs/testing';
import { TokenHelper } from './token-helper';

describe('TokenHelper', () => {
  let provider: TokenHelper;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenHelper],
    }).compile();
    provider = module.get<TokenHelper>(TokenHelper);
  });
  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
