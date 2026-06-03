const { validationResult } = require('express-validator');
const { jsonResponse, validationResponse } = require('../utils/jsonResponse');

function handleValidationErrors(message = 'Validation failed.') {
  return (req, res, next) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
      res.status(400).send(jsonResponse(message, validationResponse(errors)));
      return;
    }

    next();
  };
}

module.exports = {
  handleValidationErrors
};
