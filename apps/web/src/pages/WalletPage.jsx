import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import SkeletonCard from '../components/SkeletonCard';
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock, Sparkles, Filter, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WalletPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'EARNED', 'SPENT', 'PENDING'

  useEffect(() => {
    api.get('/credits/history')
      .then(res => {
        if (res.success) setTransactions(res.transactions || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredTx = transactions.filter(tx => {
    const isSender = String(tx.senderId?._id || tx.senderId) === String(user?._id || user?.id);
    if (filter === 'EARNED') return !isSender && tx.status === 'SUCCESS';
    if (filter === 'SPENT') return isSender && tx.status === 'SUCCESS';
    if (filter === 'PENDING') return tx.status === 'PENDING';
    return true;
  });

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
            <Wallet className="w-3.5 h-3.5 text-[#8B7CFF]" /> VISUAL TIME CREDIT LEDGER
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
            Time Credit <span className="accent-gradient-text">Wallet</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your earned hours, spent credits, and lifetime skill exchange analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TimeCreditBadge credits={user?.timeCredits || 2.0} size="lg" />
        </div>
      </div>

      {/* Wallet Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <LiquidGlassCard className="p-6 space-y-3 border border-[#8B7CFF]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-[#8B7CFF]/20 flex items-center justify-center text-[#8B7CFF]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-white font-mono">
            {Number(user?.timeCredits || 2.0).toFixed(1)} <span className="text-sm text-[#8B7CFF] font-sans">Credits</span>
          </div>
          <p className="text-xs text-slate-400 pt-1">Starter incentive (+2.0) applied on signup</p>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-6 space-y-3 border border-[#10B981]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Lifetime Hours Taught</span>
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-emerald-400 font-mono">
            {Number(user?.teachingHours || 0).toFixed(1)} <span className="text-sm text-emerald-300 font-sans font-bold">Hours</span>
          </div>
          <p className="text-xs text-slate-400 pt-1">+1.0 Credit earned per hour taught</p>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-6 space-y-3 border border-[#72C7FF]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Lifetime Hours Learned</span>
            <div className="w-9 h-9 rounded-xl bg-[#72C7FF]/20 flex items-center justify-center text-[#72C7FF]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-[#72C7FF] font-mono">
            {Number(user?.learningHours || 0).toFixed(1)} <span className="text-sm text-[#72C7FF] font-sans font-bold">Hours</span>
          </div>
          <p className="text-xs text-slate-400 pt-1">Transferred upon dual confirmation</p>
        </LiquidGlassCard>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8B7CFF]" /> Transaction History Log
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.05] border border-white/10 text-xs font-bold">
            {['ALL', 'EARNED', 'SPENT', 'PENDING'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#8B7CFF] text-white font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <SkeletonCard count={3} />
        ) : filteredTx.length === 0 ? (
          <LiquidGlassCard className="p-12 text-center space-y-3 border border-dashed border-white/15">
            <Wallet className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No transactions recorded yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Complete your first 1-hour skill swap session to see live ledger entries!
            </p>
          </LiquidGlassCard>
        ) : (
          <div className="space-y-3">
            {filteredTx.map(tx => {
              const isSender = String(tx.senderId?._id || tx.senderId) === String(user?._id || user?.id);
              const partner = isSender ? tx.receiverId : tx.senderId;

              return (
                <LiquidGlassCard key={tx._id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-white/25 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isSender ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isSender ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white">
                        {isSender ? `Transferred to ${partner?.name || 'Peer Mentor'}` : `Received from ${partner?.name || 'Peer Student'}`}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Session: {tx.sessionSkillName || 'Skill Swap Session'} • {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`text-base font-black ${isSender ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isSender ? `-1.0` : `+1.0`} Credit
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {tx.status}
                    </span>
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default WalletPage;
