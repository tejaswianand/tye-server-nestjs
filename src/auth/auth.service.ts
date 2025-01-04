import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { EmailTemplates } from 'src/email/templates/email.template';
import { EmailService } from 'src/email/email.service';
import * as geoip from 'geoip-lite';
import * as os from 'os';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async sendOtp(email: string, userAgent: string, ip: string) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            const location = geoip.lookup(ip) || { country: 'Unknown', region: 'Unknown', city: 'Unknown' };

            // Instantiate UAParser to parse the user agent string
            const parser = new UAParser(userAgent);
            const browser = parser.getBrowser().name;
            const osInfo = parser.getOS().name;

            try {
                await this.prisma.otp.create({
                    data: { email, otp, expiresAt },
                });
            } catch (dbError) {
                console.error('Error saving OTP to the database:', dbError);
                return { status: false, message: 'Failed to generate OTP. Please try again later.' };
            }

            const emailHtml = EmailTemplates.otpVerification(otp, browser, osInfo, location, ip, email);

            try {
                await this.emailService.sendMail(email, 'Your OTP Code', emailHtml);
            } catch (emailError) {
                console.error('Error sending OTP email:', emailError);
                return { status: false, message: 'Failed to send OTP email. Please check your email address and try again.' };
            }

            return { status: true, message: `OTP Sent Successfully to ${email}` };
        } catch (error) {
            console.error('Unexpected error in sendOtp:', error);
            return { status: false, message: 'An unexpected error occurred. Please try again later.' };
        }
    }



    /**
     * Verify OTP and handle user login or registration.
     */
    async verifyOtp(email: string, otp: string, @Res() res: Response) {
        if (!email) {
            return res
                .status(400)
                .json({ status: false, message: 'Please provide a valid email address.' });
        }

        try {
            const existingOtp = await this.prisma.otp.findFirst({
                where: { email, otp },
            });

            if (!existingOtp || new Date(existingOtp.expiresAt) < new Date()) {
                return res
                    .status(400)
                    .json({ status: false, message: 'Invalid or expired OTP.' });
            }

            let user = await this.prisma.user.findUnique({ where: { email } });
            const isNewUser = !user;

            if (!user) {
                user = await this.prisma.user.create({ data: { email } });
            }

            const token = user.name
                ? this.jwtService.sign({ email: user.email, id: user.id })
                : '';

            const message = isNewUser
                ? 'New user created successfully.'
                : 'User found and retrieved successfully.';

            return res.status(200).json({
                status: true,
                message,
                new_user: isNewUser,
                token,
                user: { email: user.email, name: user.name },
            });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return res.status(500).json({
                status: false,
                message: error.message || 'Failed to verify OTP. Please try again later.',
            });
        }
    }

    /**
     * Register or update user information.
     */
    async registerUser(email: string, name: string) {
        if (!email || !name) {
            return {
                status: false,
                message: 'Email and name are required',
            };
        }

        try {
            const existingUser = await this.prisma.user.findUnique({ where: { email } });
            let user;

            if (existingUser) {
                user = await this.prisma.user.update({
                    where: { email },
                    data: { name },
                });
                const defaultPaymentModes = ['Cash', 'UPI', 'Debit Card', 'Credit Card'];
                const paymentModesData = defaultPaymentModes.map((name, index) => ({
                    name,
                    userId: user.id,
                    isDefault: index === 0, // First payment mode is default
                }));

                await this.prisma.paymentMode.createMany({ data: paymentModesData });
                return {
                    status: true,
                    message: 'User details updated successfully',
                    token: this.jwtService.sign({ email: user.email, id: user.id }),
                    user: { email: user.email, name: user.name },
                };
            }

            user = await this.prisma.user.create({
                data: { email, name },
            });

            const defaultPaymentModes = ['Cash', 'UPI', 'Debit Card', 'Credit Card'];
            const paymentModesData = defaultPaymentModes.map((name, index) => ({
                name,
                userId: user.id,
                isDefault: index === 0, // First payment mode is default
            }));

            await this.prisma.paymentMode.createMany({ data: paymentModesData });

            return {
                status: true,
                message: 'User registration completed successfully',
                token: this.jwtService.sign({ email: user.email, id: user.id }),
                user: { email: user.email, name: user.name },
            };
        } catch (error) {
            console.error('Error registering user:', error);
            return {
                status: false,
                message: 'Failed to register user. Please try again later.',
            };
        }
    }
}
