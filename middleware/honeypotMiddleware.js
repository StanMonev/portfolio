const AppError = require('../errors/AppError');
const { validationResponse } = require('../utils/jsonResponse');

function rejectHoneypotSubmissions(req, res, next) {
  if (typeof req.body.website === 'string' && req.body.website.trim() !== '') {
    next(new AppError('Invalid contact form submission.', {
      statusCode: 400,
      code: 'HONEYPOT_REJECTED',
      details: validationResponse({
        recaptchaToken: { msg: 'Security check failed. Please try again.' }
      })
    }));
    return;
  }

  next();
}

module.exports = {
  rejectHoneypotSubmissions
};
