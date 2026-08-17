const express = require('express');
const router = express.Router();
const { getWallet } = require('../controllers/creditController');
const { protect } = require('../middleware/authMiddleware');

router.get('/wallet', protect, getWallet);

module.exports = router;
