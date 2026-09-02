const express = require('express');
const router = express.Router();
const { 
  getProfile, updateProfile, updateSkills, addPortfolioItem, removePortfolioItem,
  updateVerifications, blockUser, unblockUser, updateSettings, exportUserData, deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile/:identifier', getProfile);
router.put('/profile', protect, updateProfile);
router.patch('/profile', protect, updateProfile);
router.put('/skills', protect, updateSkills);
router.post('/skills', protect, updateSkills);

// Portfolio
router.post('/portfolio', protect, addPortfolioItem);
router.delete('/portfolio/:itemId', protect, removePortfolioItem);

// Verification Layer
router.put('/verify', protect, updateVerifications);

// Safety & Blocking
router.post('/block', protect, blockUser);
router.post('/unblock', protect, unblockUser);

// Settings, Export & Deletion
router.put('/settings', protect, updateSettings);
router.get('/export', protect, exportUserData);
router.delete('/account', protect, deleteAccount);

module.exports = router;
