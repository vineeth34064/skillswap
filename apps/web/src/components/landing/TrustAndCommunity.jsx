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
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-20 relative z-10">
        
        {/* TRUST SECTION */}
        <div className="space-y-12">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-base border border-white/15 text-slate-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Platform Security & Verification
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              KNOWLEDGE REQUIRES <span className="text-[#A1ACBC]">TRUST.</span>
            </h2>
            <p className="text-sm text-[#A1ACBC]">
              Built with robust verification, peer reviews, transparent trust scores, and credit escrow protection.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRUST_FEATURES.map((f, i) => {
              const IconComponent = f.icon;
              return (
                <ScrollReveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-6 rounded-3xl liquid-glass-base border border-white/10 flex items-start gap-4 bg-[#0D1118]/80 cursor-pointer transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl liquid-glass-base border border-white/15 flex items-center justify-center text-[#8B7CFF] shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-base text-white">{f.title}</h4>
                      <p className="text-xs text-[#A1ACBC] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* COMMUNITY FLOATING ISLANDS */}
        <div className="space-y-10 pt-6">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-base border border-[#8B7CFF]/30 text-[#8B7CFF] text-xs font-bold">
              <Users className="w-3.5 h-3.5" /> Organic Knowledge Hubs
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SKILLS BECOME <span className="accent-gradient-rare">COMMUNITIES.</span>
            </h2>
            <p className="text-sm text-[#A1ACBC]">
              Join specialized skill guilds to participate in group workshops, study circles, and peer mentoring.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITIES.map((c, i) => (
              <ScrollReveal key={i} direction="zoom" delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="p-6 rounded-3xl liquid-glass-base border border-white/10 space-y-4 cursor-pointer group hover:border-[#8B7CFF]/50 transition-all bg-[#0D1118]/80"
                  onClick={() => navigate('/discover')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{c.icon}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold">
                      {c.members}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-white group-hover:text-[#8B7CFF] transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-xs text-[#A1ACBC] mt-1">Active peer exchanges & group sessions daily</p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#D6B36A] font-bold">
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
