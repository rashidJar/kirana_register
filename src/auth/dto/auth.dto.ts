import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/use-cases/user/types/users.enum';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    storeId?: string;
  };
  access_token: string;
}
