const AppError = require('../errors/AppError');

function createRateLimiter({ windowMs, max, code = 'RATE_LIMIT_EXCEEDED', message = 'Too many requests. Please try again later.' }) {
  const hits = new Map();

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  }, Math.max(windowMs, 1000));

  cleanupTimer.unref?.();

  return (req, res, next) => {
    const key = `${req.ip}:${req.method}:${req.originalUrl.split('?')[0]}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    entry.count += 1;

    if (entry.count > max) {
      next(new AppError(message, {
        statusCode: 429,
        code,
        details: { retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
      }));
      return;
    }

    next();
  };
}

module.exports = {
  createRateLimiter
};
