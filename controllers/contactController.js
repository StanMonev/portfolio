const path = require('path');
const emailService = require('../services/emailService');
const { jsonResponse } = require('../utils/jsonResponse');

async function sendEmail(req, res) {
  const mailOptions = {
    templatePath: path.join(__dirname, '..', 'views', 'partials', 'emailForm.ejs'),
    templateData: {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      text: req.body.message
    },
    fromEmail: process.env.FROM_EMAIL,
    toEmail: process.env.TO_EMAIL,
    subject: req.body.subject,
    text: req.body.message
  };

  try {
    await emailService.setupMailer(mailOptions);
    res.status(200).send(jsonResponse('E-Mail sent successfully!'));
  } catch (error) {
    res.status(500).send(jsonResponse(error.message));
  }
}

module.exports = {
  sendEmail
};
