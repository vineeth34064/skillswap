const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateSkills } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile/:identifier', getProfile);
router.put('/profile', protect, updateProfile);
router.patch('/profile', protect, updateProfile);
router.put('/skills', protect, updateSkills);
router.post('/skills', protect, updateSkills);

module.exports = router;
