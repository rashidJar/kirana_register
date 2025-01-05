import { SetMetadata } from '@nestjs/common';
import { RateLimitConfig } from 'src/common/interceptors/rateLimitInterceptor';

export const RATE_LIMIT_KEY = 'rate_limit';

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  points: 10,
  duration: 60,
};
export const RateLimit = (config: RateLimitConfig) =>
  SetMetadata(RATE_LIMIT_KEY, config);
