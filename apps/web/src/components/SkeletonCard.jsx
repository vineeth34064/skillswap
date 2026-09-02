import React from 'react';

const SkeletonCard = ({ className = '', count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`p-6 rounded-3xl bg-white/[0.04] border border-white/10 animate-pulse space-y-4 ${className}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-white/15 rounded-md w-1/3" />
              <div className="h-3 bg-white/10 rounded-md w-1/2" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-white/10 rounded-md w-full" />
            <div className="h-3 bg-white/10 rounded-md w-4/5" />
          </div>
          <div className="pt-3 flex items-center justify-between border-t border-white/5">
            <div className="h-4 bg-white/10 rounded-full w-20" />
            <div className="h-8 bg-white/15 rounded-xl w-28" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
