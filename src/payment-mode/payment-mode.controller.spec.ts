import { Test, TestingModule } from '@nestjs/testing';
import { PaymentModeController } from './payment-mode.controller';

describe('PaymentModeController', () => {
  let controller: PaymentModeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentModeController],
    }).compile();

    controller = module.get<PaymentModeController>(PaymentModeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
