const express = require('express');
const router = express.Router();
const { fileDispute, getDisputes, resolveDispute } = require('../controllers/disputeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, fileDispute);
router.get('/', protect, admin, getDisputes);
router.patch('/:disputeId/resolve', protect, admin, resolveDispute);

module.exports = router;
