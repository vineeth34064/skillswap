const express = require('express');
const router = express.Router();
const { getReels, createReel, toggleLikeReel } = require('../controllers/reelController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getReels);
router.post('/', protect, createReel);
router.post('/:reelId/like', protect, toggleLikeReel);

module.exports = router;
