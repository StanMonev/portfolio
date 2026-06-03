const { check } = require('express-validator');

const recaptchaTokenValidation = [
  check('recaptchaToken').notEmpty().withMessage('Security check is required')
];

module.exports = {
  recaptchaTokenValidation
};
