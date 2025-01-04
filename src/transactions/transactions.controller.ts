import { Controller, Post, Body, Get, Param, Delete, Put, Request, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TransactionCreateDto } from './dto/transaction-create.dto';
import { TransactionUpdateDto } from './dto/transaction-update.dto';
import { Response } from 'express';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @Post('create')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createTransaction(
        @Request() req,
        @Body() transactionData: TransactionCreateDto,
        @Res() res: Response
    ) {
        const userId = req.user.userId;
        return this.transactionService.createTransaction(userId, transactionData, res);
    }

    @Get()
    async getTransactions(@Request() req, @Res() res: Response) {
        const userId = req.user.userId;
        return this.transactionService.getTransactions(userId, res);
    }

    @Put('update/:id')
    async updateTransaction(
        @Request() req,
        @Param('id') id: string,
        @Body() transactionData: TransactionUpdateDto,
        @Res() res: Response
    ) {
        const userId = req.user.userId;
        const tid = parseInt(id, 10);
        if (isNaN(tid)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid transaction ID.',
            });
        }
        return this.transactionService.updateTransaction(tid, userId, transactionData, res);
    }

    @Delete('delete/:id')
    async deleteTransaction(
        @Request() req,
        @Param('id') id: string,
        @Res() res: Response
    ) {
        const userId = req.user.userId;
        const tid = parseInt(id, 10);
        if (isNaN(tid)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid transaction ID.',
            });
        }
        return this.transactionService.deleteTransaction(tid, userId, res);
    }
    @Get('spends')
    async getSpends(
        @Request() req,
        @Res() res: Response
    ) {
        const userId = req.user.userId;
        return await this.transactionService.getSpends(userId, res);
    }
}
