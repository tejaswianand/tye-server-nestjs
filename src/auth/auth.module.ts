import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './middleware/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [JwtModule.register({ secret: env.JWT_SECRET, signOptions: { expiresIn: '24h' } }), PrismaModule, PassportModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule { }
