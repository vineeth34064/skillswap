import React, { useRef } from 'react';

const SpotlightCard = ({ children, className = '', level = 'elevated', onClick }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const levelClasses = {
    subtle: 'glass-subtle',
    elevated: 'glass-elevated',
    premium: 'glass-premium'
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`spotlight-card ${levelClasses[level]} rounded-3xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
