import { SetMetadata } from '@nestjs/common';
import { RateLimitConfig } from 'src/common/interceptors/rateLimitInterceptor';

export const RATE_LIMIT_KEY = 'rate_limit';
export const RateLimit = (config: RateLimitConfig) =>
  SetMetadata(RATE_LIMIT_KEY, config);
