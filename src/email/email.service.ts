import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    async sendMail(to: string, subject: string, html: string) {
        const mailOptions = {
            from: `"track.ye" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        };
        await this.transporter.sendMail(mailOptions);
    }
}
