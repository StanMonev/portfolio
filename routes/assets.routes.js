const express = require('express');
const assetController = require('../controllers/assetController');

const router = express.Router();

router.get('/api/images', assetController.getImages);

module.exports = router;
