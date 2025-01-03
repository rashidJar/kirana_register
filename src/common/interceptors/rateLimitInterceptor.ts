import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

export interface RateLimitConfig {
  points: number; // Number of requests allowed
  duration: number; // Time window in seconds
  blockDuration?: number; // Optional blocking duration in seconds
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || 'guest';
    const ip = request.ip;
    const path = request.route.path;

    // Create a unique key for the user/IP and endpoint
    const key = `rate_limit:${path}:${userId}:${ip}`;

    try {
      const isAllowed = await this.redisService.isRequestAllowed(key);

      if (!isAllowed) {
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please try again later.',
            retryAfter: await this.redisService.getTimeToReset(key),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return next.handle();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Rate limiting error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
