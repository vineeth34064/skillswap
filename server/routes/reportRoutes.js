const express = require('express');
const router = express.Router();
const { submitReport, getReports } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, submitReport);
router.get('/', protect, admin, getReports);

module.exports = router;
