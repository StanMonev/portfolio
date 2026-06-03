function getDebugMode(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ debug: process.env.NODE_ENV !== 'production' }));
}

function getEmailForm(req, res) {
  res.render('partials/emailForm');
}

module.exports = {
  getDebugMode,
  getEmailForm
};
