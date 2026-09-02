import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Award, ShieldCheck, XCircle, CheckCircle2, QrCode, Calendar, Clock, User } from 'lucide-react';

const VerifyCertificatePage = () => {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/certificates/verify/${certId}`)
      .then(res => {
        if (res.success) setCert(res.certificate);
        else setError(res.message);
      })
      .catch(err => setError(err.message || 'Certificate verification failed'))
      .finally(() => setLoading(false));
  }, [certId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 relative z-10 text-white space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> OFFICIAL QR VERIFICATION ENDPOINT
        </div>
        <h1 className="text-3xl font-black text-white">Certificate Verification</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm animate-pulse">Verifying credential against SkillSwap Blockchain ledger...</div>
      ) : error ? (
        <LiquidGlassCard className="p-8 text-center space-y-3 border border-rose-500/40">
          <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Invalid Certificate</h3>
          <p className="text-xs text-slate-400">{error}</p>
        </LiquidGlassCard>
      ) : (
        <LiquidGlassCard className="p-8 space-y-6 border border-[#D6B36A]/50 bg-[#080E24]/90">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#D6B36A] border-b border-white/10 pb-4">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> VERIFIED GENUINE CREDENTIAL</span>
            <span>ID: {cert.certificateId}</span>
          </div>

          <div className="space-y-4 text-center">
            <Award className="w-14 h-14 text-[#D6B36A] mx-auto" />
            <h2 className="text-2xl font-extrabold text-white">{cert.skillName}</h2>
            <p className="text-xs text-slate-300">
              Awarded to <strong className="text-white text-sm">{cert.studentId?.name}</strong> for completing {cert.hoursCompleted} hour(s) of 1-to-1 mentorship.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Student</span>
              <span className="font-bold text-white">{cert.studentId?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Peer Mentor</span>
              <span className="font-bold text-[#72C7FF]">{cert.mentorId?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Issued On</span>
              <span className="font-bold text-white">{new Date(cert.issuedAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Mentor Trust Score</span>
              <span className="font-bold text-emerald-400">{cert.mentorId?.trustScore || 98}%</span>
            </div>
          </div>
        </LiquidGlassCard>
      )}
    </div>
  );
};

export default VerifyCertificatePage;
