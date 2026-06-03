const { check } = require('express-validator');

const contactFormValidation = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid Email Address'),
  check('subject').notEmpty().withMessage('Subject is required'),
  check('message').notEmpty().withMessage('Message is required'),
  check('recaptchaToken').notEmpty().withMessage('Security check is required')
];

module.exports = {
  contactFormValidation
};
