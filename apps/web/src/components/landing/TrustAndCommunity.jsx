import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Award, Users, Lock, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LiquidGlassCard from '../LiquidGlassCard';
import ScrollReveal from './ScrollReveal';

const COMMUNITIES = [
  { name: 'C++ Systems Guild', members: '480+ Members', icon: '💻', color: '#8B7CFF' },
  { name: 'UI/UX Design Lab', members: '620+ Members', icon: '🎨', color: '#8B7CFF' },
  { name: 'Python & AI Academy', members: '850+ Members', icon: '⚡', color: '#72C7FF' },
  { name: 'Acoustic Music Club', members: '310+ Members', icon: '🎸', color: '#D6B36A' },
  { name: 'Polyglot Language Hub', members: '540+ Members', icon: '🌍', color: '#D6B36A' }
];

const TRUST_FEATURES = [
  { title: 'Verified Peer Profiles', desc: 'Identity verification & Trust Scores (0-100) computed from real completed swaps.', icon: ShieldCheck },
  { title: '5-Star Peer Review System', desc: 'Post-session star ratings & written feedback published directly to community leaderboards.', icon: Star },
  { title: 'Escrow Protection', desc: 'Time credits held securely in escrow until both parties confirm successful session completion.', icon: Lock },
  { title: 'Community Guidelines & Moderation', desc: 'Dedicated admin oversight & automated flagging for safe, respectful knowledge exchange.', icon: HeartHandshake }
];

const TrustAndCommunity = () => {
  const navigate = useNavigate();

  return (
    <section id="trust" className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-20 relative z-10">
        
        {/* TRUST SECTION */}
        <div className="space-y-16">
          <ScrollReveal direction="up" className="text-center max-w-4xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-white/20 text-slate-200 text-xs sm:text-sm font-mono font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Platform Security & Verification
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
              KNOWLEDGE REQUIRES <span className="text-[#A1ACBC]">TRUST.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A1ACBC] max-w-xl mx-auto leading-relaxed">
              Built with robust verification, peer reviews, transparent trust scores, and credit escrow protection.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRUST_FEATURES.map((f, i) => {
              const IconComponent = f.icon;
              return (
                <ScrollReveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-5 sm:p-6 rounded-2xl border border-white/20 flex items-start gap-4 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-2xl shadow-sm cursor-pointer transition-all"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.06] border border-white/20 backdrop-blur-md flex items-center justify-center text-[#8B7CFF] shrink-0 shadow-sm">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-base sm:text-lg text-white">{f.title}</h4>
                      <p className="text-xs sm:text-sm text-[#A1ACBC] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* COMMUNITY FLOATING ISLANDS */}
        <div className="space-y-10 pt-6">
          <ScrollReveal direction="up" className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-base border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold shadow-sm">
              <Users className="w-3.5 h-3.5" /> Organic Knowledge Hubs
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
              SKILLS BECOME <span className="accent-gradient-rare drop-shadow-[0_0_20px_rgba(214,179,106,0.4)]">COMMUNITIES.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A1ACBC] max-w-xl mx-auto leading-relaxed">
              Join specialized skill guilds to participate in group workshops, study circles, and peer mentoring.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {COMMUNITIES.map((c, i) => (
              <ScrollReveal key={i} direction="zoom" delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="p-8 sm:p-9 rounded-3xl border border-white/20 space-y-6 cursor-pointer group hover:border-[#8B7CFF]/60 transition-all bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  onClick={() => navigate('/discover')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{c.icon}</span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-mono font-bold">
                      {c.members}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-xl sm:text-2xl text-white group-hover:text-[#8B7CFF] transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-sm text-[#A1ACBC] mt-2">Active peer exchanges & group sessions daily</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-[#D6B36A] font-bold">
                    <span>Explore Guild</span>
                    <span>Join Free →</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustAndCommunity;
