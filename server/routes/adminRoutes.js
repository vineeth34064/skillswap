const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  toggleUserSuspension,
  getDisputes,
  resolveDispute,
  mergeSkills
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/users', protect, adminOnly, getUsers);
router.patch('/users/:userId/suspend', protect, adminOnly, toggleUserSuspension);
router.get('/disputes', protect, adminOnly, getDisputes);
router.patch('/disputes/:disputeId/resolve', protect, adminOnly, resolveDispute);
router.post('/skills/merge', protect, adminOnly, mergeSkills);

module.exports = router;
