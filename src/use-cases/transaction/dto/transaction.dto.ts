import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsString,
  IsDateString,
} from 'class-validator';
import { Currency, TransactionType } from '../types/currency.enum';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  storeId: string;
}

export class TransactionResponseDto {
  id: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  description: string;
  convertedAmount: number;
  storeId: string;
  timestamp: Date;
}

export class GetReportDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  storeId: string;
}

export class TransactionSummary {
  totalCredits: number;
  totalDebits: number;
  netFlow: number;
  periodStart: string;
  periodEnd: string;
  transactionCount: number;
  averageTransactionAmount: number;
}
