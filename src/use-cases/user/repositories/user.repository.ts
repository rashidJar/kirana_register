import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserRole } from '../types/users.enum';

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

  async addStoreToUser(
    userId: string,
    roles: Map<string, UserRole>,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, { $set: { roles } }, { new: true })
      .exec();
  }
}
