const express = require('express');
const cookieController = require('../controllers/cookieController');

const router = express.Router();

router.post('/api/track', cookieController.trackAnalytics);
router.post('/api/set-preference', cookieController.setCookiePreference);
router.get('/api/analytics', cookieController.getAnalyticsData);

module.exports = router;
