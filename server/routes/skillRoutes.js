const express = require('express');
const router = express.Router();
const { getAllSkills, createSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllSkills);
router.post('/', createSkill);
router.post('/custom', createSkill);

module.exports = router;
