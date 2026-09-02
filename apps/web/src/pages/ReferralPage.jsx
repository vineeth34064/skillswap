import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LiquidGlassCard from '../components/LiquidGlassCard';
import SkeletonCard from '../components/SkeletonCard';
import { Gift, Copy, Check, Users, Sparkles, Zap, Trophy } from 'lucide-react';

const ReferralPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [claimCode, setClaimCode] = useState('');
  const [claiming, setClaiming] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/referrals/stats');
      if (res.success) setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCopy = () => {
    if (!data?.referralCode) return;
    navigator.clipboard.writeText(data.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!claimCode.trim()) return;
    setClaiming(true);
    try {
      const res = await api.post('/referrals/claim', { code: claimCode });
      if (res.success) {
        alert(res.message);
        setClaimCode('');
        fetchStats();
      }
    } catch (err) {
      alert(err.message || 'Invalid referral code');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-[#D6B36A] text-xs font-mono font-bold">
          <Gift className="w-3.5 h-3.5 text-[#D6B36A]" /> VIRAL GROWTH ENGINE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
          Referral & <span className="accent-gradient-text">Rewards</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Invite friends to SkillSwap. Earn <strong>+0.5 Time Credits</strong> for every friend who completes their first skill exchange session!
        </p>
      </div>

      {loading ? (
        <SkeletonCard count={2} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Your Unique Code Card */}
          <LiquidGlassCard className="p-6 space-y-6 border border-[#D6B36A]/50 bg-[#101827]/90">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#D6B36A]">YOUR PERSONAL REFERRAL CODE</span>
              <h3 className="text-2xl font-black text-white">Share Your Link</h3>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-between font-mono">
              <span className="text-xl font-black tracking-widest text-[#72C7FF]">{data?.referralCode}</span>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl accent-gradient-bg text-[#05070A] font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-glow hover:scale-105 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[10px]">Friends Invited</span>
                <span className="text-2xl font-black text-white">{data?.referrals?.length || 0}</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400 block text-[10px]">Credits Earned</span>
                <span className="text-2xl font-black text-[#D6B36A]">+{data?.totalEarnedCredits || 0.0} hrs</span>
              </div>
            </div>
          </LiquidGlassCard>

          {/* Claim Invited Code Card */}
          <LiquidGlassCard className="p-6 space-y-6 border border-white/15">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#8B7CFF]">HAVE A FRIEND'S CODE?</span>
              <h3 className="text-2xl font-black text-white">Claim +0.5 Bonus Credit</h3>
            </div>

            <form onSubmit={handleClaim} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Enter referral code (e.g. SARAH-SWAP)..."
                value={claimCode}
                onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl bg-[#0D1524] border border-white/20 text-white font-mono text-xs uppercase"
              />
              <button
                type="submit"
                disabled={claiming}
                className="w-full py-3 rounded-2xl bg-[#8B7CFF] hover:bg-[#72C7FF] text-[#05070A] font-black text-xs shadow-glow transition-all cursor-pointer"
              >
                {claiming ? 'Verifying...' : 'Claim Referral Reward 🎁'}
              </button>
            </form>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-white">How it works:</p>
              <p>1. Enter your friend's code above.</p>
              <p>2. Complete 1 skill exchange workshop.</p>
              <p>3. Both of you instantly get +0.5 Time Credits credited to your wallet!</p>
            </div>
          </LiquidGlassCard>

        </div>
      )}

    </div>
  );
};

export default ReferralPage;
