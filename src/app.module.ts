import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './databse/database.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './use-cases/user/user.module';
import { UserController } from './use-cases/user/controllers/user.controller';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TransactionController } from './use-cases/transaction/controllers/transaction.controller';
import { TransactionModule } from './use-cases/transaction/transaction.module';
import { CacheModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    TransactionModule,
    CacheModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    TransactionController,
  ],
  providers: [JwtService, AppService],
})
export class AppModule {}
