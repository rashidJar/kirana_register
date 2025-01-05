import { RateLimitConfig } from '../interceptors/rateLimitInterceptor';

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  points: 5,
  duration: 60,
};
