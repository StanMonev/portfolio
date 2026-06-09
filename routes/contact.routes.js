const express = require('express');
const contactController = require('../controllers/contactController');
const recaptchaService = require('../services/recaptchaService');
const { contactFormValidation } = require('../validators/contactValidator');
const { rejectHoneypotSubmissions } = require('../middleware/honeypotMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const { verifyRecaptchaToken } = require('../middleware/recaptchaMiddleware');
const { contactRateLimiter } = require('../middleware/rateLimiters');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.post(
  '/contact',
  contactRateLimiter,
  contactFormValidation,
  rejectHoneypotSubmissions,
  handleValidationErrors('Some form elements are not full.'),
  verifyRecaptchaToken(recaptchaService.verifyContactToken),
  asyncHandler(contactController.sendEmail)
);

module.exports = router;
