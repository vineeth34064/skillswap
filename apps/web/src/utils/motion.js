/**
 * SkillSwap Central Motion Configuration System
 * Masterclass Framer Motion Presets, Physics, and Animation Variants
 */

export const motionConfig = {
  spring: {
    type: 'spring',
    stiffness: 180,
    damping: 22,
    mass: 1
  },
  gentleSpring: {
    type: 'spring',
    stiffness: 120,
    damping: 26,
    mass: 1.2
  },
  snappySpring: {
    type: 'spring',
    stiffness: 300,
    damping: 24
  },
  bouncySpring: {
    type: 'spring',
    stiffness: 260,
    damping: 18
  },
  fast: {
    duration: 0.25,
    ease: [0.25, 1, 0.5, 1]
  },
  medium: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
  },
  slow: {
    duration: 1.0,
    ease: [0.16, 1, 0.3, 1]
  },
  cinematic: {
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1]
  }
};

export const variants = {
  // Fade and Lift
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: motionConfig.medium
    }
  },

  // Blur-to-Sharp Focus Effect
  fadeBlur: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 20 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: motionConfig.cinematic
    }
  },

  // Masked Header Reveal (overflow hidden)
  maskReveal: {
    hidden: { y: '110%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  },

  // 3D Card Settling In
  cardSettle3D: {
    hidden: { opacity: 0, rotateX: 8, scale: 0.94, y: 40 },
    visible: {
      opacity: 1,
      rotateX: 0,
      scale: 1,
      y: 0,
      transition: motionConfig.spring
    }
  },

  // Scale In
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: motionConfig.medium
    }
  },

  // Directional Slide
  slideLeft: {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: motionConfig.medium
    }
  },
  slideRight: {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: motionConfig.medium
    }
  },

  // Stagger Container
  staggerContainer: (staggerDelay = 0.1) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05
      }
    }
  }),

  // SVG Path Reveal
  pathReveal: {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: 'easeInOut'
      }
    }
  }
};
