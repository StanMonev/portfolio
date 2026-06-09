const express = require('express');

const healthRoutes = require('./health.routes');
const pagesRoutes = require('./pages.routes');
const contactRoutes = require('./contact.routes');
const downloadRoutes = require('./download.routes');
const assetsRoutes = require('./assets.routes');
const resumeRoutes = require('./resume.routes');
const cookieRoutes = require('./cookie.routes');
const authRoutes = require('./auth.routes');
const debugRoutes = require('./debug.routes');

const router = express.Router();

router.use(healthRoutes);
router.use(pagesRoutes);
router.use(contactRoutes);
router.use(downloadRoutes);
router.use(assetsRoutes);
router.use(resumeRoutes);
router.use(cookieRoutes);
router.use(authRoutes);

if (process.env.NODE_ENV !== 'production') {
  router.use(debugRoutes);
}

module.exports = router;
