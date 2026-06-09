/**
 * emailService.js
 *
 * This service file contains the setup for sending emails using the Resend Email API.
 * It provides functionality to send emails with dynamic content rendered using EJS templates.
 *
 * Key functionalities:
 * - Configure the email API request using environment variables for secure email delivery.
 * - Render dynamic email content using EJS templates.
 * - Send emails with both plain text and HTML content.
 *
 * This service is essential for handling email notifications, user communications, and other
 * email-based functionalities within the application.
 */

const ejs = require('ejs');

const DEFAULT_REQUEST_TIMEOUT_MS = 10000;

/**
 * Configures and sends an email using Resend and EJS for templating.
 * 
 * @param {Object} mailOptions - An object containing email sending options:
 *    @param {string} mailOptions.fromEmail - The sender's email address.
 *    @param {string} mailOptions.toEmail - The recipient's email address.
 *    @param {string} mailOptions.subject - The subject of the email.
 *    @param {string} mailOptions.text - The plain text version of the email content.
 *    @param {string} mailOptions.templatePath - The path to the EJS template file.
 *    @param {Object} mailOptions.templateData - The data to be injected into the EJS template.
 * @returns {Promise<Object>} - Returns information about the sent email if successful.
 * @throws {Error} - Throws an error if email sending fails.
 */

const setupMailer = async (mailOptions) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const data = await ejs.renderFile(mailOptions.templatePath, mailOptions.templateData);
  const requestTimeoutMs = Number.parseInt(process.env.EMAIL_REQUEST_TIMEOUT_MS || String(DEFAULT_REQUEST_TIMEOUT_MS), 10);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number.isFinite(requestTimeoutMs) ? requestTimeoutMs : DEFAULT_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        from: mailOptions.fromEmail,
        to: [mailOptions.toEmail],
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: data
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email.');
    }

    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Email service request timed out.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// ///////
// Export
// ///////

module.exports = {
  setupMailer
};
