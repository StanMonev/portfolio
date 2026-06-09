const { createRateLimiter } = require('./rateLimitMiddleware');

const contactRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  code: 'CONTACT_RATE_LIMIT_EXCEEDED'
});

const downloadRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  code: 'DOWNLOAD_RATE_LIMIT_EXCEEDED'
});

const loginRateLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  code: 'LOGIN_RATE_LIMIT_EXCEEDED'
});

module.exports = {
  contactRateLimiter,
  downloadRateLimiter,
  loginRateLimiter
};
