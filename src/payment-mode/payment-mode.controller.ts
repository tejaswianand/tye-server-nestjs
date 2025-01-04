import { Controller, UseGuards, Post, Body, Get, Put, Param, Delete, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentModeService } from './payment-mode.service';
import { Response } from 'express';


@Controller('payment-modes')
@UseGuards(AuthGuard('jwt'))
export class PaymentModeController {
    constructor(private paymentModeService: PaymentModeService) { }

    @Post('add')
    async addPaymentMethod(@Request() req, @Body('name') name: string) {
        const userId = req.user.userId;
        return await this.paymentModeService.addPaymentMethod(userId, name);
    }

    @Get()
    async getPaymentMethods(@Request() req) {
        const userId = req.user.userId;
        return await this.paymentModeService.getPaymentMethods(userId);
    }

    @Put('update/:id')
    async updatePaymentMethod(@Request() req, @Param('id') id: number, @Body('name') name: string, @Res() res: Response) {
        const userId = req.user.userId;
        const paymentMethod = await this.paymentModeService.getPaymentMethods(userId);
        const isAuthorized = paymentMethod.some((mode) => mode.id == id);
        if (!isAuthorized) {
            throw new Error('Unauthorized to update this payment method.');
        }
        return await this.paymentModeService.updatePaymentMethod(Number(id), name, res);
    }

    @Delete('delete/:id')
    async deletePaymentMethod(@Request() req, @Param('id') id: number, @Res() res: Response) {
        const userId = req.user.userId;
        return await this.paymentModeService.deletePaymentMethod(Number(id), userId, res);
    }
    @Post('set-default/:id')
    async setDefaultPaymentMode(@Param('id') id: number, @Body('userId') userId: number, @Res() res: Response) {
        return this.paymentModeService.setDefaultPaymentMode(Number(id), userId, res);
    }
}
