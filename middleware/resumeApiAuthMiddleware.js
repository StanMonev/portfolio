const crypto = require('crypto');
const AppError = require('../errors/AppError');

function requireResumeApiAccess(req, res, next) {
  if (req.session?.userId) {
    next();
    return;
  }

  const expectedApiKey = process.env.RESUME_API_KEY;

  if (!expectedApiKey) {
    next(new AppError('Resume API access is not configured.', {
      statusCode: 500,
      code: 'RESUME_API_KEY_NOT_CONFIGURED',
      expose: process.env.NODE_ENV !== 'production'
    }));
    return;
  }

  const providedApiKey = req.get('x-resume-api-key') || req.get('x-api-key') || '';

  if (!safeCompare(providedApiKey, expectedApiKey)) {
    next(new AppError('Unauthorized resume API request.', {
      statusCode: 401,
      code: 'RESUME_API_UNAUTHORIZED'
    }));
    return;
  }

  next();
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

module.exports = {
  requireResumeApiAccess
};
