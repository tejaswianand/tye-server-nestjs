import { Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionUpdateDto } from './dto/transaction-update.dto';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subWeeks, subDays, startOfYear, subMonths } from 'date-fns';


@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) { }

    async createTransaction(
        userId: number,
        transactionData: TransactionCreateDto,
        @Res() res: Response
    ) {
        try {
            const transaction = await this.prisma.transaction.create({
                data: {
                    ...transactionData,
                    userId,
                },
            });
            return res.status(201).json({
                status: true,
                message: 'Transaction created successfully.',
                transaction,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }
    async getTransactions(userId: number, @Res() res: Response) {
        try {
            const transactions = await this.prisma.transaction.findMany({
                where: { userId },
            });
            return res.status(200).json({
                status: true,
                message: 'Transactions fetched successfully.',
                transactions,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }
    async updateTransaction(
        transactionId: number,
        userId: number,
        transactionData: TransactionUpdateDto,
        @Res() res: Response
    ) {
        try {
            const transaction = await this.prisma.transaction.findUnique({
                where: { id: transactionId },
            });

            if (!transaction || transaction.userId !== userId) {
                return res.status(403).json({
                    status: false,
                    message: 'Unauthorized or transaction not found.',
                });
            }

            const updatedTransaction = await this.prisma.transaction.update({
                where: { id: transactionId },
                data: transactionData,
            });

            return res.status(200).json({
                status: true,
                message: 'Transaction updated successfully.',
                updatedTransaction,
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }

    async deleteTransaction(
        transactionId: number,
        userId: number,
        @Res() res: Response
    ) {
        try {
            const transaction = await this.prisma.transaction.findUnique({
                where: { id: transactionId },
            });

            if (!transaction || transaction.userId !== userId) {
                return res.status(403).json({
                    status: false,
                    message: 'Unauthorized or transaction not found.',
                });
            }

            await this.prisma.transaction.delete({
                where: { id: transactionId },
            });

            return res.status(200).json({
                status: true,
                message: 'Transaction deleted successfully.',
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }

    ///

    private async getTotalSpend(userId: number, startDate: Date, endDate: Date) {
        return await this.prisma.transaction.aggregate({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                amount: true, // Sum up the amounts within the given date range
            },
        });
    }

    // Get the spends for various periods
    async getSpends(userId: number,
        @Res() res: Response
    ) {
        try {
            const today = new Date();

            // Spend this month
            const startOfMonthDate = startOfMonth(today);
            const endOfMonthDate = endOfMonth(today);
            const spendsThisMonth = await this.getTotalSpend(userId, startOfMonthDate, endOfMonthDate);

            // Spend this week
            const startOfWeekDate = startOfWeek(today);
            const endOfWeekDate = endOfWeek(today);
            const spendsThisWeek = await this.getTotalSpend(userId, startOfWeekDate, endOfWeekDate);

            // Spend last week
            const startOfLastWeek = startOfWeek(subWeeks(today, 1));
            const endOfLastWeek = endOfWeek(subWeeks(today, 1));
            const spendsLastWeek = await this.getTotalSpend(userId, startOfLastWeek, endOfLastWeek);

            // Spend last month
            const startOfLastMonth = startOfMonth(subMonths(today, 1));
            const endOfLastMonth = endOfMonth(subMonths(today, 1));
            const spendsLastMonth = await this.getTotalSpend(userId, startOfLastMonth, endOfLastMonth);

            // Spend last 7 days
            const sevenDaysAgo = subDays(today, 7);
            const spendsLast7Days = await this.getTotalSpend(userId, sevenDaysAgo, today);

            // Get date-wise spends for this month
            const thisMonthSpends = await this.prisma.transaction.findMany({
                where: {
                    userId,
                    date: {
                        gte: startOfMonthDate,
                        lte: endOfMonthDate,
                    },
                },
                select: {
                    date: true,
                    amount: true,
                },
            });
            const data = {
                spends_this_month: spendsThisMonth._sum.amount || 0,
                spends_this_week: spendsThisWeek._sum.amount || 0,
                spends_last_week: spendsLastWeek._sum.amount || 0,
                spends_last_month: spendsLastMonth._sum.amount || 0,
                spends_last_7_days: spendsLast7Days._sum.amount || 0,
                this_month: thisMonthSpends.map(txn => ({
                    date: format(txn.date, 'EEE, dd MMMM, yyyy'),
                    amount: txn.amount,
                })),
            }
            return res.status(200).json({
                status: true,
                data: data,
                message: 'Data Fetched',
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message || 'Internal Server Error',
            });
        }
    }
}
