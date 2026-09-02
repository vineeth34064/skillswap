const express = require('express');
const router = express.Router();
const { logAttendance, getSessionAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/log', protect, logAttendance);
router.get('/:sessionId', protect, getSessionAttendance);

module.exports = router;
