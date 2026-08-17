const express = require('express');
const router = express.Router();
const {
  createSessionRequest,
  respondToSessionRequest,
  confirmSessionCompletion,
  getUserSessions,
  deleteSession,
  clearPastSessions
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserSessions);
router.post('/request', protect, createSessionRequest);
router.delete('/clear-past', protect, clearPastSessions);
router.patch('/:sessionId/respond', protect, respondToSessionRequest);
router.patch('/:sessionId/confirm', protect, confirmSessionCompletion);
router.delete('/:sessionId', protect, deleteSession);

module.exports = router;
