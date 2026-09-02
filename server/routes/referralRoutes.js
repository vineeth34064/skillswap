const express = require('express');
const router = express.Router();
const { getReferralStats, claimReferral } = require('../controllers/referralController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getReferralStats);
router.post('/claim', protect, claimReferral);

module.exports = router;
