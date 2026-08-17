const Skill = require('../models/Skill');

// AI Skill Normalization map for instant mapping
const SKILL_ALIASES = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'java script': 'JavaScript',
  'cpp': 'C++',
  'c plus plus': 'C++',
  'c++ programming': 'C++',
  'py': 'Python',
  'python3': 'Python',
  'reactjs': 'React',
  'react.js': 'React',
  'ui/ux': 'UI/UX Design',
  'ui ux': 'UI/UX Design',
  'figma': 'UI/UX Design',
  'photoshop': 'Photoshop',
  'adobe photoshop': 'Photoshop',
  'ps': 'Photoshop'
};

const getAllSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, skills });
  } catch (err) {
    next(err);
  }
};

const createSkill = async (req, res, next) => {
  try {
    let { name, category, description, difficulty } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Name and category are required' });
    }

    const cleanInput = name.trim().toLowerCase();
    const normalizedName = SKILL_ALIASES[cleanInput] || name.trim();

    let skill = await Skill.findOne({ name: { $regex: `^${normalizedName}$`, $options: 'i' } });

    if (skill) {
      return res.json({ success: true, skill, normalized: true, message: `Matched with existing skill: ${skill.name}` });
    }

    skill = await Skill.create({
      name: normalizedName,
      category,
      description: description || `Master the art of ${normalizedName}`,
      difficulty: difficulty || 'Intermediate',
      isCustom: true,
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, skill });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSkills, createSkill };
