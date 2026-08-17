import React from 'react';
import { Zap } from 'lucide-react';

const TimeCreditBadge = ({ credits = 2.0, size = 'md', className = '', floatingAmount = null }) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 font-bold'
  };

  return (
    <div className={`relative inline-flex items-center rounded-full border border-[#D6B36A]/40 text-[#D6B36A] font-extrabold bg-[#101827]/90 backdrop-blur-md transition-all duration-300 shadow-gold-glow whitespace-nowrap shrink-0 ${sizeClasses[size]} ${className}`}>
      <Zap className="w-4 h-4 text-[#D6B36A] fill-[#D6B36A] shrink-0 animate-pulse" />
      <span className="tracking-wider uppercase text-[10px] text-slate-300 font-bold">TIME CREDITS</span>
      <span className="font-mono font-black text-white ml-0.5">{Number(credits).toFixed(1)}</span>

      {floatingAmount && (
        <span className="absolute -top-6 right-2 text-xs font-extrabold text-[#D6B36A] animate-bounce">
          +{floatingAmount}
        </span>
      )}
    </div>
  );
};

export default TimeCreditBadge;
