import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';
import { RATE_LIMIT_KEY } from 'src/auth/decorator/rateLimit.decorator';
import { DEFAULT_RATE_LIMIT_CONFIG } from '../constants/rateLimit.constant';
export interface RateLimitConfig {
  points: number; // Number of requests allowed
  duration: number; // Time window in seconds
}

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Get the rate limit config from the decorator
    const rateLimitConfig =
      this.reflector.get<RateLimitConfig>(
        RATE_LIMIT_KEY,
        context.getHandler(),
      ) || DEFAULT_RATE_LIMIT_CONFIG;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || 'guest';
    const ip = request.ip;
    const path = request.route.path;

    // Create a unique key for the user/IP and endpoint
    const key = `rate_limit:${path}:${userId}:${ip}`;

    try {
      const isAllowed = await this.redisService.isRequestAllowed(
        key,
        rateLimitConfig,
      );

      if (!isAllowed) {
        const retryAfter = await this.redisService.getTimeToReset(
          key,
          rateLimitConfig,
        );
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests. Please try again later.',
            retryAfter,
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
