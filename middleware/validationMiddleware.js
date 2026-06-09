const { validationResult } = require('express-validator');
const AppError = require('../errors/AppError');
const { validationResponse } = require('../utils/jsonResponse');

function handleValidationErrors(message = 'Validation failed.') {
  return (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      next(new AppError(message, {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        details: validationResponse(errors)
      }));
      return;
    }

    next();
  };
}

module.exports = {
  handleValidationErrors
};
