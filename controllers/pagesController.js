const recaptchaService = require('../services/recaptchaService');
const skills = require('../data/skills');

function getHomePage(req, res) {
  res.render('index', {
    skills,
    recaptchaSiteKey: recaptchaService.getSiteKey(),
    recaptchaAction: recaptchaService.getContactAction(),
    recaptchaDownloadAction: recaptchaService.getResumeDownloadAction()
  });
}

function getAdminPage(req, res) {
  res.render('admin');
}

/**
 * Renders the legacy resume editor page.
 *
 * @deprecated Legacy resume/CV implementation.
 */
function getResumeEditorPage(req, res) {
  res.render('resume_editor');
}

module.exports = {
  getHomePage,
  getAdminPage,
  getResumeEditorPage
};
