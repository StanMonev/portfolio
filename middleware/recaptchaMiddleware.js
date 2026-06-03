const { jsonResponse, validationResponse } = require('../utils/jsonResponse');

function verifyRecaptchaToken(verifyToken) {
  return async (req, res, next) => {
    try {
      const recaptchaResult = await verifyToken({
        token: req.body.recaptchaToken,
        remoteIp: req.ip,
        userAgent: req.get('user-agent')
      });

      if (!recaptchaResult.success) {
        res.status(400).send(jsonResponse('Security check failed. Please try again.', validationResponse({
          recaptchaToken: { msg: 'Security check failed. Please try again.' }
        })));
        return;
      }

      next();
    } catch (error) {
      res.status(500).send(jsonResponse(error.message));
    }
  };
}

module.exports = {
  verifyRecaptchaToken
};
