const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;
