const express = require('express');
const router = express.Router();
const { getRoadmaps, createRoadmap, toggleStep } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRoadmaps);
router.post('/', protect, createRoadmap);
router.patch('/:roadmapId/steps/:stepId', protect, toggleStep);

module.exports = router;
