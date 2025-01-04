import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionUpdateDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNumber()
    @IsNotEmpty()
    paymentModeId: number;

    @IsDate()
    @IsNotEmpty()
    date: Date;
}
