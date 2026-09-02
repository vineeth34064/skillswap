import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import MatchCard from '../components/MatchCard';
import SpotlightCard from '../components/SpotlightCard';
import SwapRequestModal from '../components/SwapRequestModal';
import { Repeat, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
  const navigate = useNavigate();
  const [perfectMatches, setPerfectMatches] = useState([]);
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('perfect');
  const [loading, setLoading] = useState(true);

  // Swap Request Modal State
  const [selectedSwapPartner, setSelectedSwapPartner] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches');
        if (res.success) {
          setPerfectMatches(res.perfectMatches || []);
          setRecommendedMatches(res.recommendedMatches || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleRequestSwap = (match) => {
    setSelectedSwapPartner(match.user);
  };

  const handleSendMessage = (userId) => {
    navigate('/chat', { state: { recipientId: userId } });
  };

  const currentList = activeTab === 'perfect' ? perfectMatches : [...perfectMatches, ...recommendedMatches];

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
      className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 relative z-10"
    >
      
      {/* Background Spatial Glows */}
      <div className="absolute top-10 left-1/3 w-[400px] h-[400px] bg-[#8B7CFF]/12 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 text-[#8B7CFF] text-[11px] font-mono font-bold">
            <Repeat className="w-3 h-3 text-[#8B7CFF]" /> RECIPROCAL MATCHING ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your Reciprocal <span className="accent-gradient-text">Skill Matches</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B0BAC9]">
            AI-computed match scores based on reciprocal skills, teaching ratings, and time credit balance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl liquid-glass-base border border-white/15 bg-[#0D1524]">
          <button
            onClick={() => setActiveTab('perfect')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'perfect'
                ? 'accent-gradient-bg text-[#101827] shadow-glow'
                : 'text-[#B0BAC9] hover:text-white'
            }`}
          >
            ⚡ 100% Perfect 2-Way Matches ({perfectMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'accent-gradient-bg text-[#101827] shadow-glow'
                : 'text-[#B0BAC9] hover:text-white'
            }`}
          >
            All Recommended Peers ({perfectMatches.length + recommendedMatches.length})
          </button>
        </div>
      </motion.div>

      {/* Matches Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {currentList.map((match, idx) => (
              <motion.div
                key={match._id || idx}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
              >
                <MatchCard
                  match={match}
                  onRequestSwap={handleRequestSwap}
                  onSendMessage={handleSendMessage}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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

export default Matches;
