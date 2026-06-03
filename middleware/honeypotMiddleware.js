const { jsonResponse, validationResponse } = require('../utils/jsonResponse');

function rejectHoneypotSubmissions(req, res, next) {
  if (typeof req.body.website === 'string' && req.body.website.trim() !== '') {
    res.status(400).send(jsonResponse('Invalid contact form submission.', validationResponse({
      recaptchaToken: { msg: 'Security check failed. Please try again.' }
    })));
    return;
  }

  next();
}

module.exports = {
  rejectHoneypotSubmissions
};
