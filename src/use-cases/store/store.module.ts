import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './entities/store.entity';
import { StoreService } from './services/store.service';
import { StoreRepository } from './repositories/store.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  controllers: [],
  providers: [StoreRepository, StoreService],
  exports: [StoreRepository, StoreService],
})
export class storeModule {}
