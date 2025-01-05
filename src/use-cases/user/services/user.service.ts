import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { StoreService } from 'src/use-cases/store/services/store.service';
import { UserRole } from '../types/users.enum';
import {
  AddUserToStoreDto,
  CreateStoreDto,
} from 'src/use-cases/store/dto/store.dto';
import { User } from '../entities/user.entity';

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
    const store = await this.storeService.createStore(body);
    await this.addStoreToUser(user, store._id.toString(), UserRole.ADMIN);
    return store;
  }

  async addStoreToUser(user: User, storeId: string, role: UserRole) {
    const existingRoles = user.roles || new Map<string, UserRole>();
    existingRoles.set(storeId, role);
    return this.userRepository.addStoreToUser(
      user._id.toString(),
      existingRoles,
    );
  }

  async addUserToStore(adminId: string, body: AddUserToStoreDto) {
    const user = await this.userRepository.findByEmail(body.email);
    const adminUser = await this.userRepository.findById(adminId);
    if (!adminUser || !user) {
      throw new Error('User not found');
    }
    const store = await this.storeService.findById(body.storeId);
    if (!store) {
      throw new Error('Store not found');
    }
    return this.addStoreToUser(user, store._id.toString(), body.role);
  }
}
