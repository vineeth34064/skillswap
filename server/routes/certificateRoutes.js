const express = require('express');
const router = express.Router();
const { issueCertificate, verifyCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.post('/issue', protect, issueCertificate);
router.get('/verify/:certId', verifyCertificate);

module.exports = router;
