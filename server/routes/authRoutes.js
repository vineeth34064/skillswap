const express = require('express');
const router = express.Router();
const { register, login, sendEmailOTP, verifyEmailOTP, googleAuth, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendEmailOTP);
router.post('/verify-otp', verifyEmailOTP);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

module.exports = router;
