const express = require('express');
const router = express.Router();
const { getUserAnalytics, getInvestorMetrics } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/user', protect, getUserAnalytics);
router.get('/investor', protect, admin, getInvestorMetrics);

module.exports = router;
