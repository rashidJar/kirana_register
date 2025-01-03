import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = new this.transactionModel(transactionData);
    return transaction.save();
  }

  async findByStoreId(storeId: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({ storeId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByDate(
    startDate: string,
    endDate: string,
    storeId: string,
  ): Promise<Transaction[]> {
    return this.transactionModel
      .find({ createdAt: { $gte: startDate, $lte: endDate }, storeId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
