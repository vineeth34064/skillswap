const Certificate = require('../models/Certificate');
const crypto = require('crypto');

const issueCertificate = async (req, res, next) => {
  try {
    const { studentId, skillName, hoursCompleted } = req.body;
    const certId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const cert = await Certificate.create({
      certificateId: certId,
      studentId: studentId || req.user._id,
      mentorId: req.user._id,
      skillName: skillName || 'Skill Exchange Workshop',
      hoursCompleted: hoursCompleted || 1.0,
      verificationUrl: `${req.protocol}://${req.get('host')}/verify-certificate/${certId}`
    });

    const populated = await Certificate.findById(cert._id)
      .populate('studentId', 'name username avatar')
      .populate('mentorId', 'name username avatar');

    res.json({ success: true, certificate: populated });
  } catch (err) {
    next(err);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const { certId } = req.params;
    const cert = await Certificate.findOne({ certificateId: certId.toUpperCase() })
      .populate('studentId', 'name username avatar headline')
      .populate('mentorId', 'name username avatar headline trustScore');

    if (!cert) return res.status(404).json({ success: false, message: 'Invalid or expired certificate ID' });

    res.json({ success: true, certificate: cert, isValid: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { issueCertificate, verifyCertificate };
