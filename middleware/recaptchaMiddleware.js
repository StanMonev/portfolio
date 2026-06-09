const AppError = require('../errors/AppError');
const { validationResponse } = require('../utils/jsonResponse');

function verifyRecaptchaToken(verifyToken) {
  return async (req, res, next) => {
    try {
      const recaptchaResult = await verifyToken({
        token: req.body.recaptchaToken,
        remoteIp: req.ip,
        userAgent: req.get('user-agent')
      });

      if (!recaptchaResult.success) {
        next(new AppError('Security check failed. Please try again.', {
          statusCode: 400,
          code: 'RECAPTCHA_FAILED',
          details: validationResponse({
            recaptchaToken: { msg: 'Security check failed. Please try again.' }
          })
        }));
        return;
      }

      next();
    } catch (error) {
      next(new AppError(error.message, {
        statusCode: 500,
        code: 'RECAPTCHA_UNAVAILABLE',
        expose: process.env.NODE_ENV !== 'production'
      }));
    }
  };
}

module.exports = {
  verifyRecaptchaToken
};
