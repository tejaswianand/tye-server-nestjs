import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionCreateDto {
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    paymentModeId: number;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    date: Date;
}
