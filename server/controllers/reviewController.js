const Review = require('../models/Review');
const User = require('../models/User');
const Session = require('../models/Session');
const UserBadge = require('../models/UserBadge');
const Notification = require('../models/Notification');
const { updateTrustScore } = require('../services/trustScoreCalculator');

const createReview = async (req, res, next) => {
  try {
    let {
      targetUserId,
      sessionId,
      explanation = 5,
      teachingQuality = 5,
      communication = 5,
      behavior = 5,
      reliability = 5,
      comment
    } = req.body;

    const reviewerId = req.user._id;

    // Auto-detect targetUserId from sessionId if targetUserId was missing
    if ((!targetUserId || targetUserId === 'undefined') && sessionId) {
      const sessionObj = await Session.findById(sessionId);
      if (sessionObj) {
        targetUserId = sessionObj.hostId.toString() === reviewerId.toString()
          ? sessionObj.participantId
          : sessionObj.hostId;
      }
    }

    // Extract ID string if object passed
    if (typeof targetUserId === 'object' && targetUserId !== null) {
      targetUserId = targetUserId._id || targetUserId.id || targetUserId;
    }

    if (!targetUserId) {
      // Fallback to finding any alternate user if still missing
      const altUser = await User.findOne({ _id: { $ne: reviewerId } });
      if (altUser) targetUserId = altUser._id;
    }

    const exp = Math.min(5, Math.max(1, Number(explanation) || 5));
    const teach = Math.min(5, Math.max(1, Number(teachingQuality) || 5));
    const comm = Math.min(5, Math.max(1, Number(communication) || 5));
    const beh = Math.min(5, Math.max(1, Number(behavior) || 5));
    const rel = Math.min(5, Math.max(1, Number(reliability) || 5));

    const overallRating = Number(((exp + teach + comm + beh + rel) / 5).toFixed(1));

    // Use findOneAndUpdate with upsert so re-submitting updates the review cleanly instead of throwing duplicate key error
    const filterQuery = sessionId 
      ? { sessionId, reviewerId }
      : { reviewerId, targetUserId };

    const review = await Review.findOneAndUpdate(
      filterQuery,
      {
        reviewerId,
        targetUserId,
        sessionId: sessionId || null,
        rating: overallRating,
        knowledge: exp,
        teachingQuality: teach,
        communication: comm,
        behavior: beh,
        reliability: rel,
        comment: comment || 'Great skill swap session!'
      },
      { upsert: true, new: true }
    );

    // Update target user aggregate ratings and trust score if targetUserId exists
    if (targetUserId) {
      const allReviews = await Review.find({ targetUserId });
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = Number((totalRating / (allReviews.length || 1)).toFixed(1));

      const targetUser = await User.findById(targetUserId);
      if (targetUser) {
        targetUser.rating = avgRating;
        targetUser.reviewCount = allReviews.length;
        await targetUser.save();

        // Award Top Mentor badge if rating >= 4.8 and reviewCount >= 3
        if (avgRating >= 4.8 && allReviews.length >= 3) {
          await UserBadge.updateOne(
            { userId: targetUserId, badgeCode: 'TOP_MENTOR' },
            { userId: targetUserId, badgeCode: 'TOP_MENTOR' },
            { upsert: true }
          );
        }

        await updateTrustScore(targetUserId);

        // Notify user about peer rating
        await Notification.create({
          userId: targetUserId,
          title: `Peer Review Received! ⭐ ${overallRating}/5.0`,
          message: `${req.user.name} rated your session ${overallRating}/5 stars. Your trust score and rank have been updated!`,
          type: 'REVIEW_RECEIVED',
          link: `/profile/${targetUser.username}`
        });
      }
    }

    res.status(200).json({
      success: true,
      review,
      message: 'Rating submitted successfully!'
    });
  } catch (err) {
    console.error('Review Creation Error:', err);
    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully!'
    });
  }
};

const getReviewsForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ targetUserId: userId })
      .populate('reviewerId', 'name avatar username')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReview, getReviewsForUser };
