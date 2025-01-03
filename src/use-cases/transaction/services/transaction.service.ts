import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CurrencyService } from './currency.service';
import {
  CreateTransactionDto,
  GetReportDto,
  TransactionSummary,
} from '../dto/transaction.dto';
import { StoreService } from 'src/use-cases/store/services/store.service';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../types/currency.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly currencyService: CurrencyService,
    private readonly storeService: StoreService,
  ) {}

  async createTransaction(data: CreateTransactionDto) {
    const store = await this.storeService.findById(data.storeId);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    const exchangeRate = await this.currencyService.getConversionRate(
      data.currency,
      'INR',
    );
    const amountInINR = data.amount / exchangeRate;
    const trnsactionData = {
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      storeId: data.storeId,
      amountInINR,
    };

    const transaction = await this.transactionRepository.create(trnsactionData);

    return transaction;
  }
  async generateReport(getReportDto: GetReportDto) {
    const { startDate, endDate, storeId } = getReportDto;
    const transactions = await this.transactionRepository.findByDate(
      startDate,
      endDate,
      storeId,
    );

    return this.aggregateTransactions(transactions, startDate, endDate);
  }

  private aggregateTransactions(
    transactions: Transaction[],
    startDate: string,
    endDate: string,
  ): TransactionSummary {
    const credits = transactions.filter(
      (t) => t.type === TransactionType.CREDIT,
    );
    const debits = transactions.filter((t) => t.type === TransactionType.DEBIT);

    const totalCredits = credits.reduce((sum, t) => sum + t.amountInINR, 0);
    const totalDebits = debits.reduce((sum, t) => sum + t.amountInINR, 0);

    return {
      totalCredits,
      totalDebits,
      netFlow: totalCredits - totalDebits,
      periodStart: startDate,
      periodEnd: endDate,
      transactionCount: transactions.length,
      averageTransactionAmount:
        transactions.length > 0
          ? (totalCredits + totalDebits) / transactions.length
          : 0,
    };
  }
}
