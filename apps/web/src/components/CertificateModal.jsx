import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, Download, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import api from '../api/client';

const CertificateModal = ({ isOpen, onClose, student, mentor, skillName, hoursCompleted }) => {
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/certificates/issue', {
        studentId: student?._id,
        skillName: skillName || 'Skill Exchange Workshop',
        hoursCompleted: hoursCompleted || 1.0
      });
      if (res.success) setCert(res.certificate);
    } catch (err) {
      alert(err.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-xl liquid-glass-premium rounded-3xl border border-[#D6B36A]/40 p-8 bg-[#101827]/95 space-y-6 relative text-white"
        >
          <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>

          {!cert ? (
            <div className="text-center space-y-4 py-6">
              <Award className="w-16 h-16 text-[#D6B36A] mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-white">Generate Verifiable Certificate</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Commemorate your 1-to-1 completed workshop in <strong>{skillName || 'Skill Exchange'}</strong> with an official QR-verified SkillSwap Certificate.
              </p>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-3 rounded-2xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all cursor-pointer"
              >
                {loading ? 'Issuing Certificate...' : 'Issue Verifiable Certificate 🎉'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Certificate Border Card */}
              <div className="p-8 rounded-3xl bg-[#080E24] border-4 border-[#D6B36A]/50 space-y-6 text-center relative overflow-hidden">
                <div className="flex justify-between items-center text-xs text-[#D6B36A] font-mono font-bold">
                  <span>SKILLSWAP VERIFIED CREDENTIAL</span>
                  <span>ID: {cert.certificateId}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black accent-gradient-text tracking-tight">Certificate of Completion</h3>
                  <p className="text-xs text-slate-400">This certifies that</p>
                  <h4 className="text-2xl font-extrabold text-white">{cert.studentId?.name || student?.name}</h4>
                  <p className="text-xs text-slate-300">has successfully completed <strong>{cert.hoursCompleted} Hour(s)</strong> of 1-to-1 training in</p>
                  <h5 className="text-lg font-black text-[#72C7FF]">{cert.skillName}</h5>
                  <p className="text-[11px] text-slate-400 pt-1">Guided by Mentor: <span className="text-white font-bold">{cert.mentorId?.name || mentor?.name}</span></p>
                </div>

                {/* QR Code Container */}
                <div className="pt-4 flex items-center justify-between border-t border-white/10 text-left text-[10px] text-slate-400 font-mono">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-emerald-400 font-bold"><ShieldCheck className="w-3.5 h-3.5" /> Authentic QR Verification</p>
                    <p>{cert.verificationUrl}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center text-[#D6B36A]">
                    <QrCode className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => window.print()} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" /> Download / Print PDF
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CertificateModal;
