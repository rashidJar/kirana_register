import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Currency, TransactionType } from '../types/currency.enum';

@Schema({ timestamps: true, collection: 'transaction' })
export class Transaction {
  @Prop({ type: mongoose.Schema.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: Currency })
  currency: Currency;

  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ required: true })
  amountInINR: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Store', required: true })
  storeId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
