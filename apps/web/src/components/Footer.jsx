import React from 'react';
import { Repeat, Heart, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-subtle text-[#94A3B8] border-t border-white/10 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-signature-bg flex items-center justify-center shadow-glow">
                <Repeat className="w-5 h-5 text-[#07090D] stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-white font-sans">SkillSwap</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Exchange Skills, Not Money. A private digital network where time is the currency for learning and sharing knowledge.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-elevated border border-[#D6B36A]/30 text-xs text-[#D6B36A] font-semibold">
              <Zap className="w-3.5 h-3.5 fill-[#D6B36A]" />
              <span>Time Credit Economy</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="/discover" className="hover:text-[#8B7CFF] transition-colors">Browse Skills</a></li>
              <li><a href="/matches" className="hover:text-[#8B7CFF] transition-colors">Direct Swaps</a></li>
              <li><a href="#how-it-works" className="hover:text-[#D6B36A] transition-colors">How Time Credits Work</a></li>
              <li><a href="#trust" className="hover:text-[#72C7FF] transition-colors">Trust & Verification</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Popular Skills</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="hover:text-[#8B7CFF] transition-colors cursor-pointer">C++ & Algorithms</span></li>
              <li><span className="hover:text-[#8B7CFF] transition-colors cursor-pointer">UI/UX & Figma</span></li>
              <li><span className="hover:text-[#8B7CFF] transition-colors cursor-pointer">Python & Data Science</span></li>
              <li><span className="hover:text-[#72C7FF] transition-colors cursor-pointer">Spanish & French</span></li>
              <li><span className="hover:text-[#D6B36A] transition-colors cursor-pointer">Acoustic Guitar</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Community Guarantee</h4>
            <div className="p-4 rounded-2xl glass-elevated border border-white/10 text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#72C7FF] font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Anti-Fraud Protected
              </div>
              <p className="text-[#94A3B8] leading-normal text-[11px]">
                Credits are only released when both participants confirm session completion. Safe, secure, and community driven.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-xs text-center text-[#64748B] flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} SkillSwap Platform. Built for lifelong learners worldwide.
          </div>
          <div className="flex items-center gap-1.5 text-[#94A3B8]">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>for community knowledge sharing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
