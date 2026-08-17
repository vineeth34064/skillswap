const express = require('express');
const router = express.Router();
const { createReview, getReviewsForUser } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/user/:userId', getReviewsForUser);

module.exports = router;
