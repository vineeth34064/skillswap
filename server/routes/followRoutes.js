const express = require('express');
const router = express.Router();
const { toggleFollow, getFollowStats } = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

router.post('/toggle', protect, toggleFollow);
router.get('/stats/:userId', getFollowStats);

module.exports = router;
