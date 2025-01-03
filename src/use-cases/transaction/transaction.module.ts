import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { storeModule } from '../store/store.module';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { CurrencyService } from './services/currency.service';
import { CacheModule } from 'src/common/redis/redis.module';
import { RedisService } from 'src/common/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    storeModule,
    CacheModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionRepository,
    TransactionService,
    CurrencyService,
    RedisService,
  ],
  exports: [TransactionRepository, TransactionService],
})
export class TransactionModule {}
