const express = require('express');
const downloadController = require('../controllers/downloadController');
const recaptchaService = require('../services/recaptchaService');
const { recaptchaTokenValidation } = require('../validators/recaptchaValidator');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const { verifyRecaptchaToken } = require('../middleware/recaptchaMiddleware');
const { downloadRateLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.get('/api/download-button', downloadController.getDownloadButton);
router.post(
  '/api/resume-download/verify',
  downloadRateLimiter,
  recaptchaTokenValidation,
  handleValidationErrors('Security check failed. Please try again.'),
  verifyRecaptchaToken(recaptchaService.verifyResumeDownloadToken),
  downloadController.verifyResumeDownload
);

module.exports = router;
