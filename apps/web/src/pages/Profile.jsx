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
          <div className="space-y-3">
            {profile.reviews.map((r, i) => (
              <div key={i} className="p-4 rounded-2xl glass-subtle border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={r.reviewerId?.avatar} alt={r.reviewerId?.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold text-xs text-white">{r.reviewerId?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#D6B36A] font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
                    <span>{r.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-[#94A3B8] italic">"{r.comment}"</p>
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
