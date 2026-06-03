const https = require('https');

const CONTACT_ACTION = 'contact_submit';
const RESUME_DOWNLOAD_ACTION = 'resume_download';
const DEFAULT_MIN_SCORE = 0.5;
const RECAPTCHA_HOST = 'recaptchaenterprise.googleapis.com';

async function verifyContactToken({ token, remoteIp, userAgent }) {
  return verifyToken({
    token,
    expectedAction: CONTACT_ACTION,
    remoteIp,
    userAgent
  });
}

async function verifyResumeDownloadToken({ token, remoteIp, userAgent }) {
  return verifyToken({
    token,
    expectedAction: RESUME_DOWNLOAD_ACTION,
    remoteIp,
    userAgent
  });
}

async function verifyToken({ token, expectedAction, remoteIp, userAgent }) {
  const config = _getConfig();

  if (!token) {
    return { success: false, reason: 'missing-token' };
  }

  const assessment = await _createAssessment({
    ...config,
    token,
    expectedAction,
    remoteIp,
    userAgent
  });

  const tokenProperties = assessment.tokenProperties || {};

  if (!tokenProperties.valid) {
    return {
      success: false,
      reason: tokenProperties.invalidReason || 'invalid-token'
    };
  }

  if (tokenProperties.action !== expectedAction) {
    return {
      success: false,
      reason: 'action-mismatch'
    };
  }

  const score = assessment.riskAnalysis?.score;

  if (typeof score !== 'number' || score < config.minScore) {
    return {
      success: false,
      reason: 'low-score',
      score
    };
  }

  return {
    success: true,
    score
  };
}

function getSiteKey() {
  return process.env.RECAPTCHA_SITE_KEY || '';
}

function getContactAction() {
  return CONTACT_ACTION;
}

function getResumeDownloadAction() {
  return RESUME_DOWNLOAD_ACTION;
}

function _getConfig() {
  const siteKey = getSiteKey();
  const projectId = process.env.RECAPTCHA_PROJECT_ID || '';
  const apiKey = process.env.RECAPTCHA_API_KEY || '';
  const minScore = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE || String(DEFAULT_MIN_SCORE));

  if (!siteKey || !projectId || !apiKey) {
    throw new Error('reCAPTCHA is not configured.');
  }

  return {
    siteKey,
    projectId,
    apiKey,
    minScore: Number.isFinite(minScore) ? minScore : DEFAULT_MIN_SCORE
  };
}

function _createAssessment({ projectId, apiKey, siteKey, token, expectedAction, remoteIp, userAgent }) {
  const requestBody = JSON.stringify({
    event: {
      token,
      siteKey,
      expectedAction,
      userAgent,
      userIpAddress: remoteIp
    }
  });

  const options = {
    hostname: RECAPTCHA_HOST,
    method: 'POST',
    path: `/v1/projects/${encodeURIComponent(projectId)}/assessments?key=${encodeURIComponent(apiKey)}`,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let responseBody = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        responseBody += chunk;
      });

      res.on('end', () => {
        let parsedBody = {};

        try {
          parsedBody = responseBody ? JSON.parse(responseBody) : {};
        } catch (error) {
          reject(new Error('reCAPTCHA returned an invalid response.'));
          return;
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(parsedBody.error?.message || 'reCAPTCHA assessment request failed.'));
          return;
        }

        resolve(parsedBody);
      });
    });

    req.on('error', () => {
      reject(new Error('reCAPTCHA assessment request failed.'));
    });

    req.write(requestBody);
    req.end();
  });
}

module.exports = {
  getContactAction,
  getResumeDownloadAction,
  getSiteKey,
  verifyContactToken,
  verifyResumeDownloadToken
};
