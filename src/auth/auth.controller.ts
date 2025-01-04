import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('send-otp')
    async sendOtp(
        @Body('email') email: string,
        @Body('userAgent') userAgent: string,  // Add userAgent
        @Body('ip') ip: string,  // Add ip
    ) {
        return this.authService.sendOtp(email, userAgent, ip);
    }
    @Post('verify-otp')
    async verifyOtp(@Body('email') email: string, @Body('otp') otp: string, @Res() res: Response) { return this.authService.verifyOtp(email, otp, res) }
    @Post('register-user')
    async registerUser(@Body('email') email: string, @Body('name') name: string) { return this.authService.registerUser(email, name) }
}
