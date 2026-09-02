import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, X, Phone, Mail, GraduationCap, Linkedin, Award } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const VerificationModal = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !user) return null;

  const verifs = user.verifications || { phone: true, email: true, college: false, linkedin: false, govId: false, mentor: true };

  const handleVerify = async (key) => {
    setLoading(true);
    try {
      const res = await api.put('/users/verify', { [key]: true });
      if (res.success) {
        await refreshUser();
        setSuccessMsg(`Successfully verified ${key.toUpperCase()}! 🎉`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md liquid-glass-premium rounded-3xl border border-white/20 p-6 bg-[#101827]/95 space-y-5 relative text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">Verification Center</h3>
              <p className="text-xs text-slate-400">Elevate your Trust Score & Leaderboard rank</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Email */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#72C7FF]" />
                <div>
                  <h4 className="text-xs font-bold">Email Verified</h4>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                <Check className="w-3 h-3" /> VERIFIED
              </span>
            </div>

            {/* Phone */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8B7CFF]" />
                <div>
                  <h4 className="text-xs font-bold">Phone Number</h4>
                  <p className="text-[10px] text-slate-400">SMS Verification Code</p>
                </div>
              </div>
              {verifs.phone ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <button
                  onClick={() => handleVerify('phone')}
                  disabled={loading}
                  className="px-3 py-1 rounded-xl bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/40 text-xs font-bold hover:bg-[#8B7CFF]/30 cursor-pointer"
                >
                  Verify
                </button>
              )}
            </div>

            {/* College */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-[#D6B36A]" />
                <div>
                  <h4 className="text-xs font-bold">College / University (.edu)</h4>
                  <p className="text-[10px] text-slate-400">Student & Alumni Status</p>
                </div>
              </div>
              {verifs.college ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <button
                  onClick={() => handleVerify('college')}
                  disabled={loading}
                  className="px-3 py-1 rounded-xl bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/40 text-xs font-bold hover:bg-[#D6B36A]/30 cursor-pointer"
                >
                  Verify
                </button>
              )}
            </div>

            {/* LinkedIn */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-sky-400" />
                <div>
                  <h4 className="text-xs font-bold">LinkedIn Profile</h4>
                  <p className="text-[10px] text-slate-400">Professional Identity</p>
                </div>
              </div>
              {verifs.linkedin ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3 h-3" /> VERIFIED
                </span>
              ) : (
                <button
                  onClick={() => handleVerify('linkedin')}
                  disabled={loading}
                  className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-bold hover:bg-sky-500/30 cursor-pointer"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VerificationModal;
