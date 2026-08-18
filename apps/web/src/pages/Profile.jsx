import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import TimeCreditBadge from '../components/TimeCreditBadge';
import SpotlightCard from '../components/SpotlightCard';
import { Star, ShieldCheck, MapPin, Award, BookOpen, Clock, CheckCircle2, MessageSquare, Repeat } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${username}`);
        if (res.success) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm animate-pulse">Loading profile information...</div>;
  }

  if (!profile) {
    return <div className="py-20 text-center text-slate-400 text-sm">User profile not found.</div>;
  }

  return (
    <div className="max-w-[96%] sm:max-w-[98%] mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6 relative z-10">
      
      {/* Profile Top Hero Card */}
      <SpotlightCard level="premium" className="p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-[#8B7CFF]/40 shadow-glow"
          />

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
              {profile.isVerified && (
                <ShieldCheck className="w-5 h-5 text-[#8B7CFF]" title={`Trust Score: ${profile.trustScore}`} />
              )}
            </div>

            <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-2">
              <span>@{profile.username}</span> •
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.city}</span>
            </p>

            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{profile.bio}"
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <TimeCreditBadge credits={profile.timeCredits} size="lg" />
            <div className="flex items-center gap-1 text-[#D6B36A] font-bold text-sm">
              <Star className="w-4 h-4 fill-[#D6B36A]" />
              <span>{profile.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-slate-400 font-normal">({profile.reviewCount || 0} reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-center">
          <div>
            <span className="block text-2xl font-extrabold text-[#8B7CFF] font-mono">{profile.teachingHours || 0}</span>
            <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider">Teaching Hours</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-[#72C7FF] font-mono">{profile.learningHours || 0}</span>
            <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider">Learning Hours</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-emerald-400 font-mono">{profile.trustScore || 90}</span>
            <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider">Trust Score</span>
          </div>
        </div>
      </SpotlightCard>

      {/* Skills Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Teaches */}
        <SpotlightCard level="elevated" className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8B7CFF]" /> Skills Offered (Teaches)
          </h3>
          <div className="space-y-2">
            {profile.teachSkills && profile.teachSkills.length > 0 ? (
              profile.teachSkills.map((s, i) => (
                <div key={i} className="p-3 rounded-2xl glass-subtle border border-[#8B7CFF]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#8B7CFF]">{s.skillId?.name}</span>
                    <span className="block text-[10px] text-[#94A3B8]">{s.skillId?.category}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] text-[10px] font-bold">
                    {s.level}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400">No teaching skills listed yet.</span>
            )}
          </div>
        </SpotlightCard>

        {/* Wants */}
        <SpotlightCard level="elevated" className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#72C7FF]" /> Skills Wanted (Wants to Learn)
          </h3>
          <div className="space-y-2">
            {profile.learnSkills && profile.learnSkills.length > 0 ? (
              profile.learnSkills.map((s, i) => (
                <div key={i} className="p-3 rounded-2xl glass-subtle border border-[#72C7FF]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#72C7FF]">{s.skillId?.name}</span>
                    <span className="block text-[10px] text-[#94A3B8]">{s.skillId?.category}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#72C7FF]/20 text-[#72C7FF] text-[10px] font-bold">
                    {s.level}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400">No learning goals listed yet.</span>
            )}
          </div>
        </SpotlightCard>

      </div>

      {/* Reviews Section */}
      <SpotlightCard level="elevated" className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-[#D6B36A] fill-[#D6B36A]" /> Peer Reviews ({profile.reviews?.length || 0})
        </h3>

        {profile.reviews && profile.reviews.length > 0 ? (
          <div className="space-y-4">
            {profile.reviews.map((r, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-2xl glass-subtle border border-white/10 bg-white/[0.03] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={r.reviewerId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt={r.reviewerId?.name} className="w-9 h-9 rounded-xl object-cover border border-white/15" />
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-white block">{r.reviewerId?.name || 'Verified Peer'}</span>
                      <span className="text-[10px] text-[#94A3B8]">@{r.reviewerId?.username || 'member'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-[#D6B36A] font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
                    <span>{r.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>

                {/* Multi-Criterion Breakdown Pills */}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  {r.reliability && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300">
                      Punctuality: ⭐ {r.reliability}.0
                    </span>
                  )}
                  {r.knowledge && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300">
                      Clarity: ⭐ {r.knowledge}.0
                    </span>
                  )}
                  {r.teachingQuality && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300">
                      Teaching: ⭐ {r.teachingQuality}.0
                    </span>
                  )}
                  {r.communication && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300">
                      Communication: ⭐ {r.communication}.0
                    </span>
                  )}
                  {r.behavior && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300">
                      Respect: ⭐ {r.behavior}.0
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5 italic">
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400">No reviews received yet.</div>
        )}
      </SpotlightCard>

    </div>
  );
};

export default Profile;
