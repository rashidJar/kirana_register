import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimitConfig } from '../interceptors/rateLimitInterceptor';
import {
  BLOCK_DURATION,
  REQUEST_ALLOWED,
  TIME_DURATION,
} from './redis.constant';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: any, expiry?: number): Promise<void> {
    try {
      if (expiry) {
        await this.redis.set(key, JSON.stringify(value), 'EX', expiry);
      } else {
        await this.redis.set(key, JSON.stringify(value));
      }
    } catch (error) {
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);

      if (!value) {
        return null;
      }
      return JSON.parse(value);
    } catch (error) {
      throw error;
    }
  }

  private getRateLimitConfig(): RateLimitConfig {
    return {
      points: REQUEST_ALLOWED,
      duration: TIME_DURATION,
      blockDuration: BLOCK_DURATION,
    };
  }

  async isRequestAllowed(key: string): Promise<boolean> {
    const now = Date.now();
    const config = this.getRateLimitConfig();

    const multi = this.redis.multi();

    // Clean up old records
    multi.zremrangebyscore(key, 0, now - config.duration * 1000);

    // Count existing records
    multi.zcard(key);

    // Add new request
    multi.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry
    multi.expire(key, config.duration);

    const results = await multi.exec();
    const requestCount = results[1][1] as number;

    return requestCount < config.points;
  }

  async getTimeToReset(key: string): Promise<number> {
    const oldest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
    if (!oldest.length) return 0;

    const oldestTimestamp = parseInt(oldest[1]);
    const config = this.getRateLimitConfig();
    const reset = oldestTimestamp + config.duration * 1000;

    return Math.max(0, Math.ceil((reset - Date.now()) / 1000));
  }
}
