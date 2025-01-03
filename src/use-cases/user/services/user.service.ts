import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { StoreService } from 'src/use-cases/store/services/store.service';
import { UserRole } from '../types/users.enum';
import {
  AddUserToStoreDto,
  CreateStoreDto,
} from 'src/use-cases/store/dto/store.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storeService: StoreService,
  ) {}

  async createStore(userId: string, body: CreateStoreDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.storeId) {
      throw new Error('User already has a store');
    }
    const store = await this.storeService.createStore(body);
    await this.addStoreToUser(userId, store._id.toString(), UserRole.ADMIN);
    return store;
  }

  async addStoreToUser(userId: string, storeId: string, role: UserRole) {
    return this.userRepository.addStoreToUser(userId, storeId, role);
  }

  async addUserToStore(adminId: string, body: AddUserToStoreDto) {
    const user = await this.userRepository.findByEmail(body.email);
    const adminUser = await this.userRepository.findById(adminId);
    if (!adminUser || !user) {
      throw new Error('User not found');
    }
    if (!adminUser.storeId || adminUser.storeId !== body.storeId) {
      throw new Error('User does not have access to store');
    }
    if (user.storeId) {
      throw new Error('User already has a store');
    }
    const store = await this.storeService.findById(body.storeId);
    if (!store) {
      throw new Error('Store not found');
    }
    return this.addStoreToUser(
      user._id.toString(),
      store._id.toString(),
      body.role,
    );
  }
}
