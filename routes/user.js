const express = require('express');

const router = express.Router();

const user = require('../controllers/user');

// uptime robot check
router.post('/signup', user.singupUser);
router.post('/login', user.loginUser);
router.post('/invalid_email_check', user.invalidEmailCheck);
router.post('/send_reset_password_token', user.sendResetPasswordToken);
router.get('/validate_password_token', user.validatePasswordToken);
router.post('/reset_password', user.resetPassword);

module.exports = router;
