import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';  // Importing express types


@Injectable()
export class PaymentModeService {
    constructor(private prisma: PrismaService) { }

    async addPaymentMethod(userId: number, name: string) {
        const paymentMode = await this.prisma.paymentMode.create({
            data: { name, userId },
        });
        return { message: 'Payment method added successfully.', paymentMode };
    }

    async getPaymentMethods(userId: number) {
        return await this.prisma.paymentMode.findMany({ where: { userId } });
    }

    async updatePaymentMethod(paymentModeId: number, name: string, @Res() res: Response) {
        try {
            const updatedPaymentMethod = await this.prisma.paymentMode.update({
                where: { id: paymentModeId },
                data: { name },
            });
            return res.status(200).json({
                status: true,
                message: 'Payment Method Name Updated.',
                data: updatedPaymentMethod
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }


    async deletePaymentMethod(paymentModeId: number, userId: number, @Res() res: Response) {
        try {
            const paymentMode = await this.prisma.paymentMode.findUnique({
                where: { id: paymentModeId },
            });
            if (!paymentMode || paymentMode.userId !== userId) {
                return res.status(404).json({
                    status: false,
                    message: 'Payment method not found or unauthorized.',
                });
            }
            if (paymentMode.isDefault) {
                return res.status(400).json({
                    status: false,
                    message: 'Cannot delete the default payment method.',
                });
            }
            const paymentMethodsCount = await this.prisma.paymentMode.count({
                where: { userId: userId },
            });
            if (paymentMethodsCount <= 1) {
                return res.status(400).json({
                    status: false,
                    message: 'Cannot delete the only payment method.',
                });
            }
            await this.prisma.paymentMode.delete({
                where: { id: paymentModeId },
            });
            return res.status(200).json({
                status: true,
                message: 'Payment method deleted successfully.',
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }

    async setDefaultPaymentMode(id: number, userId: number, @Res() res: Response) {
        try {
            await this.prisma.paymentMode.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
            const updatedPaymentMode = await this.prisma.paymentMode.update({
                where: { id },
                data: { isDefault: true },
            });
            return res.status(200).json({
                status: true,
                message: `Default Payment Mode Set to ${updatedPaymentMode?.name}`,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }


}
