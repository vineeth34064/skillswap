const { calculateMatchesForUser } = require('../services/matchingService');

const getMatches = async (req, res, next) => {
  try {
    const matches = await calculateMatchesForUser(req.user._id);

    const perfectMatches = matches.filter(m => m.isDirectSwap);
    const topRecommended = matches.filter(m => !m.isDirectSwap);

    res.json({
      success: true,
      totalMatches: matches.length,
      perfectMatches,
      recommendedMatches: topRecommended
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMatches };
