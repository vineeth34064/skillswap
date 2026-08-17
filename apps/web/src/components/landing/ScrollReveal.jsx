import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right', 'zoom'
  once = false, // Set to false so animations re-trigger on every scroll!
  amount = 0.2
}) => {
  const getVariants = () => {
    switch (direction) {
      case 'down':
        return {
          hidden: { opacity: 0, y: -50, filter: 'blur(10px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: -60, filter: 'blur(10px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: 60, filter: 'blur(10px)' },
          visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
        };
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.85, filter: 'blur(10px)' },
          visible: { opacity: 1, scale: 1, filter: 'blur(0px)' }
        };
      case 'up':
      default:
        return {
          hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={getVariants()}
      transition={{
        type: 'spring',
        stiffness: 130,
        damping: 18,
        mass: 0.8,
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
