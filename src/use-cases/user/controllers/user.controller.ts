import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  AddUserToStoreDto,
  CreateStoreDto,
} from 'src/use-cases/store/dto/store.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from '../types/users.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/store')
  async createStore(@User('id') userId: string, @Body() body: CreateStoreDto) {
    return this.userService.createStore(userId, body);
  }

  @Post('/store/addUser')
  @Roles(UserRole.ADMIN)
  async addUserToStore(
    @User('id') adminId: string,
    @Body() body: AddUserToStoreDto,
  ) {
    return this.userService.addUserToStore(adminId, body);
  }
}
