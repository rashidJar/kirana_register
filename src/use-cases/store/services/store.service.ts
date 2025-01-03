import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Store } from '../entities/store.entity';

import { CreateStoreDto } from '../dto/store.dto';
import { StoreRepository } from '../repositories/store.repository';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeRepository: StoreRepository,
  ) {}

  async createStore(dto: CreateStoreDto): Promise<Store> {
    const store = await this.storeRepository.create({
      name: dto.name,
      isActive: true,
    });
    return store;
  }

  async findById(id: string): Promise<Store> {
    return this.storeRepository.findById(id);
  }
}
