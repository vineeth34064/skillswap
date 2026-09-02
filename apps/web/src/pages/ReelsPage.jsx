import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import LiquidGlassCard from '../components/LiquidGlassCard';
import SkeletonCard from '../components/SkeletonCard';
import { Film, Heart, Bookmark, Repeat, User, Sparkles, Plus, Play } from 'lucide-react';

const SAMPLE_REELS = [
  {
    _id: 'sample-1',
    title: 'React Custom Hooks in 30 Seconds ⚡',
    description: 'Learn how to abstract reusable stateful logic into custom React hooks easily!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41561-large.mp4',
    skillName: 'React.js',
    likesCount: 142,
    savesCount: 89,
    mentorId: {
      _id: 'm1',
      name: 'Sarah Jenkins',
      username: 'sarah_ui',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      trustScore: 98,
      headline: 'UI/UX & Frontend Specialist'
    }
  },
  {
    _id: 'sample-2',
    title: 'Mastering Spanish Subjunctive Mood 🇪🇸',
    description: 'Quick trick to remember when to use present subjunctive in conversation!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41559-large.mp4',
    skillName: 'Spanish',
    likesCount: 215,
    savesCount: 130,
    mentorId: {
      _id: 'm2',
      name: 'Elena Rostova',
      username: 'elena_spanish',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      trustScore: 95,
      headline: 'Native Language Mentor'
    }
  }
];

const ReelsPage = () => {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reels')
      .then(res => {
        if (res.success && res.reels.length > 0) {
          setReels(res.reels);
        } else {
          setReels(SAMPLE_REELS);
        }
      })
      .catch(() => setReels(SAMPLE_REELS))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = (reelId) => {
    setReels(prev => prev.map(r => {
      if (r._id === reelId) {
        return { ...r, likesCount: r.likesCount + 1 };
      }
      return r;
    }));
    api.post(`/reels/${reelId}/like`).catch(() => {});
  };

  return (
    <div className="max-w-[96%] sm:max-w-[90%] lg:max-w-[1000px] mx-auto px-4 py-6 space-y-6 relative z-10 text-white">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EC4899]/20 border border-[#EC4899]/40 text-[#EC4899] text-xs font-mono font-bold">
          <Film className="w-3.5 h-3.5 text-[#EC4899]" /> EDUCATIONAL SHORT VIDEO REELS
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Discover <span className="accent-gradient-text">Skill Reels</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Watch 30-second micro-learning clips from top community mentors and request skill swaps in 1 click!
        </p>
      </div>

      {/* Vertical Reels Container */}
      {loading ? (
        <SkeletonCard count={2} />
      ) : (
        <div className="space-y-8">
          {reels.map(reel => (
            <LiquidGlassCard key={reel._id} className="p-6 overflow-hidden relative space-y-4 max-w-xl mx-auto border border-white/20 shadow-2xl">
              
              {/* Video Player Box */}
              <div className="relative aspect-[9/16] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 border border-white/10 group">
                <video
                  src={reel.videoUrl}
                  controls
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono font-extrabold text-[#72C7FF]">
                  {reel.skillName}
                </span>
              </div>

              {/* Mentor Header & Details */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={reel.mentorId?.avatar}
                    alt={reel.mentorId?.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#8B7CFF]/40"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                      {reel.mentorId?.name}
                      <span className="px-2 py-0.5 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] text-[10px] font-mono font-bold">
                        {reel.mentorId?.trustScore || 95}% Trust
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">@{reel.mentorId?.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/sessions', { state: { targetUser: reel.mentorId } })}
                  className="px-4 py-2.5 rounded-xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Repeat className="w-4 h-4" /> Swap Skill
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h4 className="font-black text-base text-white">{reel.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{reel.description}</p>
              </div>

              {/* Interactive Engagement Controls */}
              <div className="flex items-center gap-6 pt-3 border-t border-white/10 text-xs font-bold text-slate-400">
                <button
                  onClick={() => handleLike(reel._id)}
                  className="flex items-center gap-2 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                  <span>{reel.likesCount} Likes</span>
                </button>

                <div className="flex items-center gap-2 hover:text-sky-400 transition-colors">
                  <Bookmark className="w-4 h-4 text-sky-400" />
                  <span>{reel.savesCount} Saves</span>
                </div>
              </div>

            </LiquidGlassCard>
          ))}
        </div>
      )}

    </div>
  );
};

export default ReelsPage;
