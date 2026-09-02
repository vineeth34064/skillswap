import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import MatchCard from '../components/MatchCard';
import LocationMapVisualizer from '../components/LocationMapVisualizer';
import LiquidGlassCard from '../components/LiquidGlassCard';
import GlassSelect from '../components/GlassSelect';
import SwapRequestModal from '../components/SwapRequestModal';
import { SKILL_CATEGORIES } from '../constants/shared';
import { Search, Filter, Map, Grid, Compass, Sparkles, Star, Clock, ShieldCheck, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated Mentors ⭐' },
  { value: 'hours', label: 'Most Hours Spent Teaching ⏱️' },
  { value: 'trust', label: 'Highest Trust Score 🛡️' },
  { value: 'match', label: 'Highest Match Score %' }
];

const PRESET_SEARCHES = ['C++', 'UI/UX Design', 'Python', 'React', 'Photoshop', 'Guitar', 'Spanish'];

const Discover = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  // Swap Request Modal State
  const [selectedSwapPartner, setSelectedSwapPartner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, skillRes] = await Promise.all([
          api.get('/matches'),
          api.get('/skills')
        ]);
        if (matchRes.success) {
          const combined = [...(matchRes.perfectMatches || []), ...(matchRes.recommendedMatches || [])];
          setMatches(combined);
        }
        if (skillRes.success) {
          setSkills(skillRes.skills);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequestSwap = (match) => {
    setSelectedSwapPartner(match.user);
  };

  const handleSendMessage = (userId) => {
    navigate('/chat', { state: { recipientId: userId } });
  };

  const filteredMatches = matches
    .filter((match) => {
      const q = search.trim().toLowerCase();
      const matchesCategory =
        selectedCategory === 'All' ||
        match.teachesSkills?.some((s) => s.category === selectedCategory) ||
        match.wantsSkills?.some((s) => s.category === selectedCategory);

      const matchesSearch =
        !q ||
        match.user?.name?.toLowerCase().includes(q) ||
        match.user?.username?.toLowerCase().includes(q) ||
        match.user?.city?.toLowerCase().includes(q) ||
        match.teachesSkills?.some((s) => s.name?.toLowerCase().includes(q)) ||
        match.wantsSkills?.some((s) => s.name?.toLowerCase().includes(q)) ||
        match.user?.teachSkills?.some((s) => (s.skillId?.name || s.name || '').toLowerCase().includes(q)) ||
        match.user?.learnSkills?.some((s) => (s.skillId?.name || s.name || '').toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.user?.rating || 5) - (a.user?.rating || 5);
      if (sortBy === 'hours') return (b.user?.teachingHours || 0) - (a.user?.teachingHours || 0);
      if (sortBy === 'trust') return (b.user?.trustScore || 90) - (a.user?.trustScore || 90);
      if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
      return 0;
    });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white"
    >
      
      {/* Background Spatial Glows */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-[#8B7CFF]/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Title */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 text-[#8B7CFF] text-xs font-mono font-bold">
            <Compass className="w-3.5 h-3.5 text-[#8B7CFF]" /> DISCOVER PEER MENTORS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Explore <span className="accent-gradient-text">Verified Skills</span> & Mentors
          </h1>
          <p className="text-sm text-[#B0BAC9]">
            Search by specific skills (C++, UI/UX, Python, React, Photoshop, Music) and sort by rating, hours taught, or trust score.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-2xl liquid-glass-base border border-white/15 bg-[#0D1524]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'grid'
                ? 'accent-gradient-bg text-[#101827] shadow-glow'
                : 'text-[#B0BAC9] hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" /> Grid Cards
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'map'
                ? 'accent-gradient-bg text-[#101827] shadow-glow'
                : 'text-[#B0BAC9] hover:text-white'
            }`}
          >
            <Map className="w-4 h-4" /> Spatial Radar Map
          </button>
        </div>
      </motion.div>

      {/* Search & Multi-Criterion Sorting Engine */}
      <motion.div variants={itemVariants} className="liquid-glass-premium p-6 rounded-3xl border border-white/20 shadow-glass-3d bg-[#101827]/90 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Skill Search Field */}
          <div className="lg:col-span-6 relative">
            <Search className="w-5 h-5 text-[#8B7CFF] absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill name (e.g. C++, UI/UX, Python, React, Guitar)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-sm sm:text-base placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-3">
            <GlassSelect
              options={[{ value: 'All', label: 'All Skill Categories' }, ...SKILL_CATEGORIES.map((c) => ({ value: c, label: c }))]}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          {/* Sort Criterion */}
          <div className="lg:col-span-3">
            <GlassSelect
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>

        </div>

        {/* 1-Click Skill Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-mono font-bold text-[#B0BAC9] shrink-0 mr-1">POPULAR SKILLS:</span>
          {PRESET_SEARCHES.map((skill) => (
            <motion.button
              key={skill}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearch(search === skill ? '' : skill)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold border transition-all shrink-0 cursor-pointer ${
                search === skill
                  ? 'bg-[#8B7CFF] text-white border-[#8B7CFF] shadow-glow'
                  : 'bg-white/5 border-white/15 text-[#B0BAC9] hover:border-white/30 hover:text-white'
              }`}
            >
              {skill}
            </motion.button>
          ))}
        </div>

      </motion.div>

      {/* Results View */}
      <motion.div variants={itemVariants}>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMatches.map((match, idx) => (
                <motion.div
                  key={match._id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                >
                  <MatchCard match={match} onRequestSwap={handleRequestSwap} onMessage={handleSendMessage} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <LocationMapVisualizer matches={filteredMatches} />
          </motion.div>
        )}
      </motion.div>

      {/* Swap Request Modal */}
      <SwapRequestModal
        isOpen={!!selectedSwapPartner}
        onClose={() => setSelectedSwapPartner(null)}
        targetUser={selectedSwapPartner}
      />

    </motion.div>
  );
};

export default Discover;
