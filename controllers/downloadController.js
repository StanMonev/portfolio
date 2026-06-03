const { jsonResponse } = require('../utils/jsonResponse');

function verifyResumeDownload(req, res) {
  res.status(200).send(jsonResponse('Security check passed.'));
}

function getDownloadButton(req, res) {
  res.render('partials/downloadButton', { id: 'downloadButton', css: 'download-button', text: 'DOWNLOAD RESUME' });
}

module.exports = {
  getDownloadButton,
  verifyResumeDownload
};
