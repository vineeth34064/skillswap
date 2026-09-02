const Roadmap = require('../models/Roadmap');

const getRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({ $or: [{ userId: req.user._id }, { isPublic: true }] })
      .populate('userId', 'name username avatar')
      .sort({ updatedAt: -1 });

    res.json({ success: true, roadmaps });
  } catch (err) {
    next(err);
  }
};

const createRoadmap = async (req, res, next) => {
  try {
    const { title, category, description, steps } = req.body;
    const roadmap = await Roadmap.create({
      userId: req.user._id,
      title,
      category: category || 'Technology',
      description: description || '',
      steps: steps || [
        { title: 'Fundamentals & Basics', completed: false, order: 1 },
        { title: 'Intermediate Concepts', completed: false, order: 2 },
        { title: 'Advanced Projects', completed: false, order: 3 }
      ]
    });

    res.json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
};

const toggleStep = async (req, res, next) => {
  try {
    const { roadmapId, stepId } = req.params;
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });

    const step = roadmap.steps.id(stepId);
    if (step) {
      step.completed = !step.completed;
      await roadmap.save();
    }

    res.json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRoadmaps, createRoadmap, toggleStep };
