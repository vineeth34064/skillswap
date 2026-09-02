import React from 'react';
import { motion } from 'framer-motion';
import AtmosphericBackground from '../components/landing/AtmosphericBackground';
import CustomCursor from '../components/landing/CustomCursor';
import ImmersiveHero from '../components/landing/ImmersiveHero';
import ParallaxTypography from '../components/landing/ParallaxTypography';
import InteractiveSkillSimulator from '../components/landing/InteractiveSkillSimulator';
import AnimatedMatchReveal from '../components/landing/AnimatedMatchReveal';
import TimeCreditEconomy from '../components/landing/TimeCreditEconomy';
import HorizontalSkillGallery from '../components/landing/HorizontalSkillGallery';
import SpatialSkillNetwork from '../components/landing/SpatialSkillNetwork';
import SessionSimulator from '../components/landing/SessionSimulator';
import TrustAndCommunity from '../components/landing/TrustAndCommunity';
import CinematicCTA from '../components/landing/CinematicCTA';

const sectionFadeVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
};

const LandingPage = ({ onOpenAuth }) => {
  return (
    <div className="relative text-[#F7F9FC] selection:bg-[#8B7CFF] selection:text-white min-h-screen overflow-x-hidden">
      
      {/* Dynamic Premium Atmospheric Background */}
      <AtmosphericBackground />

      {/* Custom Desktop Magnetic Cursor */}
      <CustomCursor />

      {/* Continuous Page Sections Narrative with Bi-Directional Scroll Fade */}
      <div className="relative z-10 space-y-10 sm:space-y-16">
        {/* 1. HERO Hook */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ImmersiveHero onOpenAuth={onOpenAuth} />
        </motion.div>

        {/* 2. EVERYONE KNOWS SOMETHING Typographic Parallax */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ParallaxTypography />
        </motion.div>

        {/* 3 & 4. Interactive WHAT DO YOU KNOW / WANT TO LEARN Simulator */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <InteractiveSkillSimulator />
        </motion.div>

        {/* 5. Animated Reciprocal Match Reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedMatchReveal />
        </motion.div>

        {/* 6 & 7. Time Credit Economy */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimeCreditEconomy />
        </motion.div>

        {/* 8. Horizontal Skill Carousel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <HorizontalSkillGallery />
        </motion.div>

        {/* 9 & 10. Spatial Skill Network */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SpatialSkillNetwork />
        </motion.div>

        {/* 11. Session Video Environment Simulator */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SessionSimulator />
        </motion.div>

        {/* 12 & 13. Trust & Community */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <TrustAndCommunity />
        </motion.div>

        {/* 14. Final Invitation CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={sectionFadeVariants}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <CinematicCTA />
        </motion.div>
      </div>

    </div>
  );
};

export default LandingPage;
