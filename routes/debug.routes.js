const express = require('express');
const debugController = require('../controllers/debugController');

const router = express.Router();

router.get('/debug', debugController.getDebugMode);
router.get('/emailform', debugController.getEmailForm);

module.exports = router;
