function getTACPolicyContent(req, res) {
  res.render('partials/tacPolicy');
}

function getPrivacyPolicyContent(req, res) {
  res.render('partials/privacyPolicy');
}

function getCookiePolicyContent(req, res) {
  res.render('partials/cookiePolicy');
}

function getCopyrightContent(req, res) {
  res.render('partials/copyright');
}

module.exports = {
  getTACPolicyContent,
  getPrivacyPolicyContent,
  getCookiePolicyContent,
  getCopyrightContent
};
