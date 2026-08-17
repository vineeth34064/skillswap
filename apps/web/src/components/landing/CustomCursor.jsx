import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default'); // 'default', 'hover', 'skill', 'time', 'connection'
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch desktop devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const closestSkill = target.closest('[data-cursor="skill"]');
      const closestTime = target.closest('[data-cursor="time"]');
      const closestConn = target.closest('[data-cursor="connection"]');
      const closestButton = target.closest('button, a, input, select');

      if (closestSkill) setCursorType('skill');
      else if (closestTime) setCursorType('time');
      else if (closestConn) setCursorType('connection');
      else if (closestButton) setCursorType('hover');
      else setCursorType('default');
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const getGlowColor = () => {
    switch (cursorType) {
      case 'skill':
        return 'rgba(139, 124, 255, 0.6)'; // Electric Violet
      case 'time':
        return 'rgba(214, 179, 106, 0.6)'; // Champagne Gold
      case 'connection':
        return 'rgba(114, 199, 255, 0.6)'; // Ice Blue
      case 'hover':
        return 'rgba(255, 255, 255, 0.4)';
      default:
        return 'rgba(255, 255, 255, 0.15)';
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Outer Follower Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 backdrop-blur-[2px]"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: cursorType !== 'default' ? 1.6 : 1,
          borderColor: cursorType === 'skill' ? '#8B7CFF' : cursorType === 'time' ? '#D6B36A' : cursorType === 'connection' ? '#72C7FF' : 'rgba(255,255,255,0.3)',
          boxShadow: `0 0 20px ${getGlowColor()}`
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 22, mass: 0.2 }}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: cursorType !== 'default' ? 0.5 : 1,
          backgroundColor: cursorType === 'skill' ? '#8B7CFF' : cursorType === 'time' ? '#D6B36A' : cursorType === 'connection' ? '#72C7FF' : '#F8FAFC'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.1 }}
      />
    </div>
  );
};

export default CustomCursor;
