import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { PaymentModeService } from './payment-mode/payment-mode.service';
import { PaymentModeController } from './payment-mode/payment-mode.controller';
import { ConfigModule } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';
import { TransactionsService } from './transactions/transactions.service';
import { TransactionsController } from './transactions/transactions.controller';
import { EmailService } from './email/email.service';

@Module({
  imports: [PrismaModule, AuthModule, JwtModule, ConfigModule.forRoot({
    isGlobal: true,
  }), ConsoleModule],
  controllers: [AppController, PaymentModeController, TransactionsController],
  providers: [AppService, PaymentModeService, TransactionsService, EmailService],
})
export class AppModule { }
