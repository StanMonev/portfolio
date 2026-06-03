const express = require('express');
const pagesController = require('../controllers/pagesController');
const policyController = require('../controllers/policyController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', pagesController.getHomePage);
router.get('/tac-policy-content', policyController.getTACPolicyContent);
router.get('/privacy-policy-content', policyController.getPrivacyPolicyContent);
router.get('/cookie-policy-content', policyController.getCookiePolicyContent);
router.get('/copyright-content', policyController.getCopyrightContent);
router.get('/admin', ensureAuthenticated, pagesController.getAdminPage);
router.get('/admin/resume_editor', ensureAuthenticated, pagesController.getResumeEditorPage);

module.exports = router;
