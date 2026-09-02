import React from 'react';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Shield, Lock, FileText } from 'lucide-react';

const LegalPrivacyPage = () => {
  return (
    <div className="max-w-[96%] sm:max-w-[90%] xl:max-w-[900px] mx-auto px-4 py-6 space-y-8 relative z-10 text-white">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
          <FileText className="w-3.5 h-3.5 text-[#8B7CFF]" /> GOOGLE PLAY STORE LEGAL COMPLIANCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Privacy Policy & <span className="accent-gradient-text">Terms of Service</span>
        </h1>
        <p className="text-xs text-slate-400">Last updated: September 2, 2026</p>
      </div>

      <LiquidGlassCard className="p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#72C7FF]" /> 1. Data Collection & Usage
          </h3>
          <p>
            SkillSwap collects user name, email, profile photo, location preferences, and skill declarations solely to facilitate 1-to-1 peer skill exchange sessions. We do NOT sell user data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#8B7CFF]" /> 2. Content Moderation & User Safety
          </h3>
          <p>
            SkillSwap enforces zero tolerance for harassment, hate speech, spam, or unlawful behavior. Users can block or report any profile directly in app. Reports are investigated by human moderators within 24 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D6B36A]" /> 3. Account Deletion Rights
          </h3>
          <p>
            In compliance with Google Play Store data safety guidelines, users can export their data or request complete account deletion at any time via Settings (`/settings`). All personal data is purged permanently upon confirmation.
          </p>
        </section>
      </LiquidGlassCard>

    </div>
  );
};

export default LegalPrivacyPage;
