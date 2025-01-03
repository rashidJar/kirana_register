import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from 'src/use-cases/user/types/users.enum';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AddUserToStoreDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  storeId: string;
}
