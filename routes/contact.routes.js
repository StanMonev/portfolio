const express = require('express');
const contactController = require('../controllers/contactController');
const recaptchaService = require('../services/recaptchaService');
const { contactFormValidation } = require('../validators/contactValidator');
const { rejectHoneypotSubmissions } = require('../middleware/honeypotMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const { verifyRecaptchaToken } = require('../middleware/recaptchaMiddleware');

const router = express.Router();

router.post(
  '/contact',
  contactFormValidation,
  rejectHoneypotSubmissions,
  handleValidationErrors('Some form elements are not full.'),
  verifyRecaptchaToken(recaptchaService.verifyContactToken),
  contactController.sendEmail
);

module.exports = router;
