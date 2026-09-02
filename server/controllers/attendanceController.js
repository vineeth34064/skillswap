const Attendance = require('../models/Attendance');
const Session = require('../models/Session');

const logAttendance = async (req, res, next) => {
  try {
    const { sessionId, durationMinutes } = req.body;
    const userId = req.user._id;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const totalExpectedMinutes = (session.durationHours || 1.0) * 60;
    const verifiedAttendancePercent = Math.min(100, Math.round(((durationMinutes || 48) / totalExpectedMinutes) * 100));
    const isVerified = verifiedAttendancePercent >= 80;

    const attendance = await Attendance.create({
      sessionId,
      userId,
      joinedAt: new Date(),
      durationMinutes: durationMinutes || 48,
      verifiedAttendancePercent,
      isVerified
    });

    res.json({ success: true, attendance, isVerified });
  } catch (err) {
    next(err);
  }
};

const getSessionAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const records = await Attendance.find({ sessionId }).populate('userId', 'name avatar username');
    res.json({ success: true, records });
  } catch (err) {
    next(err);
  }
};

module.exports = { logAttendance, getSessionAttendance };
