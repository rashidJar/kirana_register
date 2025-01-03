import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/use-cases/user/dto/user.dto';
import { AuthService } from '../services/auth.service';
import { AuthResponse, LoginDto } from '../dto/auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() body: CreateUserDto) {
    return this.authService.createUser(body);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }
}
