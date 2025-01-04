import { Test, TestingModule } from '@nestjs/testing';
import { PaymentModeService } from './payment-mode.service';

describe('PaymentModeService', () => {
  let service: PaymentModeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentModeService],
    }).compile();

    service = module.get<PaymentModeService>(PaymentModeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
