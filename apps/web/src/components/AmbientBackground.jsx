import React from 'react';

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Left Violet Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#8B7CFF] opacity-[0.14] blur-[130px] animate-ambient-slow" />

      {/* Top Right Champagne Gold Glow */}
      <div className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#D6B36A] opacity-[0.11] blur-[140px] animate-ambient-slow [animation-delay:4s]" />

      {/* Center Bottom Ice Blue Glow */}
      <div className="absolute top-[45%] left-[30%] w-[700px] h-[700px] rounded-full bg-[#72C7FF] opacity-[0.09] blur-[150px] animate-ambient-slow [animation-delay:8s]" />

      {/* Fine Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
};

export default AmbientBackground;
