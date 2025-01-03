import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from '../entities/store.entity';

@Injectable()
export class StoreRepository {
  constructor(@InjectModel(Store.name) private storeModel: Model<Store>) {}

  async create(data: Partial<Store>): Promise<Store> {
    return this.storeModel.create(data);
  }

  async findById(id: string): Promise<Store> {
    return this.storeModel.findById(id).exec();
  }
}
