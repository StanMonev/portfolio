const express = require('express');
const authController = require('../controllers/authController');
const { loginRateLimiter } = require('../middleware/rateLimiters');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});
router.post('/login', loginRateLimiter, asyncHandler(authController.loginUser));
router.get('/logout', authController.logoutUser);

module.exports = router;
