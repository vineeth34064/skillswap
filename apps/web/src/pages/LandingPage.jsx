import React from 'react';
import AtmosphericBackground from '../components/landing/AtmosphericBackground';
import CustomCursor from '../components/landing/CustomCursor';
import SectionNavigator from '../components/landing/SectionNavigator';
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

const LandingPage = ({ onOpenAuth }) => {
  return (
    <div className="relative text-[#F7F9FC] selection:bg-[#8B7CFF] selection:text-white min-h-screen">
      
      {/* Dynamic Premium Atmospheric Background with Scroll Color Interpolation */}
      <AtmosphericBackground />

      {/* Custom Desktop Magnetic Cursor */}
      <CustomCursor />

      {/* Desktop Section Scroll Indicator Navigator */}
      <SectionNavigator />

      {/* Continuous Page Sections Narrative */}
      <div className="relative z-10">
        {/* 1. HERO Hook (Layered Depth Parallax) */}
        <ImmersiveHero onOpenAuth={onOpenAuth} />

        {/* 2. EVERYONE KNOWS SOMETHING Typographic Parallax */}
        <ParallaxTypography />

        {/* 3 & 4. Interactive WHAT DO YOU KNOW / WANT TO LEARN Simulator */}
        <InteractiveSkillSimulator />

        {/* 5. Animated Reciprocal Match Reveal (Convergence Physics) */}
        <AnimatedMatchReveal />

        {/* 6 & 7. Time Credit Economy & 3D Glass Wallet */}
        <TimeCreditEconomy />

        {/* 8. Horizontal Skill Carousel */}
        <HorizontalSkillGallery />

        {/* 9 & 10. Spatial Skill Network & Profile Expansion */}
        <SpatialSkillNetwork />

        {/* 11. Session Video Environment Simulator */}
        <SessionSimulator />

        {/* 12 & 13. Trust & Community Guilds */}
        <TrustAndCommunity />

        {/* 14. Final Invitation CTA */}
        <CinematicCTA />
      </div>

    </div>
  );
};

export default LandingPage;
