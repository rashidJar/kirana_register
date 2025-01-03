import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserRole } from '../types/users.enum';
// import { BaseRepository } from './base.repository';
// import { UserRole } from '../types/enums';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: Partial<User>): Promise<User> {
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const user = new this.userModel(createUserDto);
  //   return user.save();
  // }

  async addStoreToUser(
    userId: string,
    storeId: string,
    role: UserRole,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, { $set: { storeId, role } }, { new: true })
      .exec();
  }

  // async findByStoreId(storeId: string): Promise<User[]> {
  //   return this.userModel.find({ storeId });
  // }

  // async findAdmins(): Promise<User[]> {
  //   return this.userModel.find({ role: UserRole.ADMIN });
  // }

  // async updateRole(userId: string, role: UserRole): Promise<User> {
  //   return this.update(userId, { role });
  // }

  // async assignToStore(
  //   userId: string,
  //   storeId: string,
  //   role: UserRole,
  // ): Promise<User> {
  //   return this.update(userId, { storeId, role });
  // }

  // async removeFromStore(userId: string): Promise<User> {
  //   return this.update(userId, { storeId: null, role: UserRole.READ_ONLY });
  // }

  // async findUnassignedUsers(): Promise<User[]> {
  //   return this.userModel.find({
  //     storeId: null,
  //     role: { $ne: UserRole.ADMIN },
  //   });
  // }

  // async searchUsers(query: string): Promise<User[]> {
  //   return this.userModel
  //     .find({
  //       $or: [
  //         { name: { $regex: query, $options: 'i' } },
  //         { email: { $regex: query, $options: 'i' } },
  //       ],
  //     })
  //     .select('-password');
  // }
}
