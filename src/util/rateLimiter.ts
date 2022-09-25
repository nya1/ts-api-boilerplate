import rateLimit from 'express-rate-limit';

/**
 * strict rate limiter for more sensitive endpoints (e.g. signup)
 *
 * returning a function will act per endpoint, remove it to make
 * the limit shared accross all endpoints
 */
export const hardRateLimiter = () =>
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1, // Limit each IP to 1 request per `window` (here, per 10 minutes)
    skipFailedRequests: true // ignore validation error requests
  });

export const softRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 900 // Limit each IP to 900 requests per `window` (here, per 15 minutes)
});
