import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/use-cases/user/dto/user.dto';
import { User } from 'src/use-cases/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/use-cases/user/repositories/user.repository';
import { AuthResponse, LoginDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
      access_token: token,
    };
  }

  async createUser(body: CreateUserDto): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(body.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(body.password, 8);

    const user = await this.userRepository.create({
      ...body,
      password: hashedPassword,
    });

    if (user) {
    }

    return this.generateAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }
}
