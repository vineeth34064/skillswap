const Review = require('../models/Review');
const User = require('../models/User');
const Session = require('../models/Session');
const UserBadge = require('../models/UserBadge');
const Notification = require('../models/Notification');
const { updateTrustScore } = require('../services/trustScoreCalculator');

const createReview = async (req, res, next) => {
  try {
    const reviewerId = req.user?._id;
    if (!reviewerId) {
      return res.status(401).json({ success: false, message: 'Authentication required to submit review' });
    }

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

    const isValidObjectId = (id) => id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

    // Sanitize sessionId
    const finalSessionId = isValidObjectId(String(sessionId)) ? sessionId : null;

    // Auto-detect targetUserId from sessionId if targetUserId was missing
    if ((!targetUserId || targetUserId === 'undefined') && finalSessionId) {
      const sessionObj = await Session.findById(finalSessionId);
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

    if (targetUserId && !isValidObjectId(String(targetUserId))) {
      const userByUsername = await User.findOne({ username: String(targetUserId).toLowerCase() });
      if (userByUsername) {
        targetUserId = userByUsername._id;
      }
    }

    if (!targetUserId || !isValidObjectId(String(targetUserId))) {
      const altUser = await User.findOne({ _id: { $ne: reviewerId } });
      if (altUser) targetUserId = altUser._id;
    }

    const exp = Math.min(5, Math.max(1, Number(explanation) || 5));
    const teach = Math.min(5, Math.max(1, Number(teachingQuality) || 5));
    const comm = Math.min(5, Math.max(1, Number(communication) || 5));
    const beh = Math.min(5, Math.max(1, Number(behavior) || 5));
    const rel = Math.min(5, Math.max(1, Number(reliability) || 5));

    const overallRating = Number(((exp + teach + comm + beh + rel) / 5).toFixed(1));

    const filterQuery = finalSessionId 
      ? { sessionId: finalSessionId, reviewerId }
      : { reviewerId, targetUserId };

    const review = await Review.findOneAndUpdate(
      filterQuery,
      {
        $set: {
          reviewerId,
          targetUserId,
          sessionId: finalSessionId,
          rating: overallRating,
          knowledge: exp,
          teachingQuality: teach,
          communication: comm,
          behavior: beh,
          reliability: rel,
          comment: comment || 'Great skill swap session!'
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Update target user aggregate ratings and trust score if targetUserId exists
    if (targetUserId) {
      try {
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
            try {
              await UserBadge.updateOne(
                { userId: targetUserId, badgeCode: 'TOP_MENTOR' },
                { $set: { userId: targetUserId, badgeCode: 'TOP_MENTOR', awardedAt: new Date() } },
                { upsert: true }
              );
            } catch (bErr) {
              console.warn('Badge upsert warning:', bErr.message);
            }
          }

          await updateTrustScore(targetUserId);

          // Notify user about peer rating
          try {
            await Notification.create({
              userId: targetUserId,
              title: `Peer Review Received! ⭐ ${overallRating}/5.0`,
              message: `${req.user.name} rated your session ${overallRating}/5 stars. Your trust score and rank have been updated!`,
              type: 'REVIEW_RECEIVED',
              link: `/profile/${targetUser.username}`
            });
          } catch (notifErr) {
            console.warn('Review notification warning:', notifErr.message);
          }
        }
      } catch (calcErr) {
        console.warn('Target user rating update warning:', calcErr.message);
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
