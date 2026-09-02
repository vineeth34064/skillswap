import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import TimeCreditBadge from '../components/TimeCreditBadge';
import SpotlightCard from '../components/SpotlightCard';
import LiquidGlassCard from '../components/LiquidGlassCard';
import ReportUserModal from '../components/ReportUserModal';
import VerificationModal from '../components/VerificationModal';
import {
  Star, ShieldCheck, MapPin, Award, BookOpen, Clock, CheckCircle2, MessageSquare, Repeat,
  Github, Linkedin, Globe, Briefcase, Plus, ShieldAlert, Flag, UserX, ExternalLink, Trash2, Check
} from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refreshUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showReportModal, setShowReportModal] = useState(false);
  const [showVerifModal, setShowVerifModal] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  // New Project Form
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectImg, setProjectImg] = useState('');
  const [projectUrl, setProjectUrl] = useState('');

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

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const isOwnProfile = currentUser && (currentUser.username === username || String(currentUser._id) === String(profile?._id));

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/portfolio', {
        title: projectTitle,
        description: projectDesc,
        imageUrl: projectImg,
        projectUrl
      });
      if (res.success) {
        setProjectTitle('');
        setProjectDesc('');
        setProjectImg('');
        setProjectUrl('');
        setShowAddProject(false);
        fetchProfile();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProject = async (itemId) => {
    if (!window.confirm('Delete this portfolio project?')) return;
    try {
      const res = await api.delete(`/users/portfolio/${itemId}`);
      if (res.success) fetchProfile();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBlockUser = async () => {
    if (!window.confirm(`Block ${profile.name}? They will no longer be able to message you or request swaps.`)) return;
    try {
      const res = await api.post('/users/block', { targetUserId: profile._id });
      if (res.success) {
        alert(`${profile.name} has been blocked.`);
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm animate-pulse">Loading profile information...</div>;
  }

  if (!profile) {
    return <div className="py-20 text-center text-slate-400 text-sm">User profile not found.</div>;
  }

  const verifs = profile.verifications || { phone: true, email: true, college: false, linkedin: false, govId: false, mentor: true };

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Cover Banner & Main Header Card */}
      <SpotlightCard level="premium" className="p-0 overflow-hidden relative border border-white/20 shadow-2xl">
        {/* Cover Image */}
        <div className="h-44 sm:h-56 w-full relative">
          <img
            src={profile.coverBanner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080E24] via-[#080E24]/50 to-transparent" />
        </div>

        {/* Profile Content Box */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative -mt-16 sm:-mt-20 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            
            {/* Avatar & Key Metadata */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-[#080E24] shadow-glow"
                />
                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#080E24]" title="Online Now" />
              </div>

              <div className="space-y-1.5 pt-2 sm:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h1>
                  {verifs.mentor && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED MENTOR
                    </span>
                  )}
                </div>

                <p className="text-sm font-extrabold text-[#72C7FF]">{profile.headline || 'SkillSwap Community Member'}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span>@{profile.username}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.city}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-[#8B7CFF]" /> {profile.persona || 'Professional'}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-[#D6B36A]" /> {profile.languages?.join(', ') || 'English'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {!isOwnProfile ? (
                <>
                  <button
                    onClick={() => navigate('/sessions', { state: { targetUser: profile } })}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-2xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Repeat className="w-4 h-4" /> Request Skill Swap
                  </button>

                  <button
                    onClick={() => navigate('/chat', { state: { targetUser: profile } })}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-[#8B7CFF]" /> Message
                  </button>

                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 cursor-pointer"
                    title="Report User"
                  >
                    <Flag className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleBlockUser}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Block User"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowVerifModal(true)}
                  className="px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-xs hover:bg-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Verification Center
                </button>
              )}
            </div>

          </div>

          {/* Social Links & Bio */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <p className="text-sm text-slate-200 leading-relaxed italic">"{profile.bio}"</p>

            <div className="flex items-center gap-4 text-xs">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white flex items-center gap-1.5 font-bold">
                  <Github className="w-4 h-4 text-[#8B7CFF]" /> GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white flex items-center gap-1.5 font-bold">
                  <Linkedin className="w-4 h-4 text-sky-400" /> LinkedIn
                </a>
              )}
              {profile.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white flex items-center gap-1.5 font-bold">
                  <Globe className="w-4 h-4 text-[#D6B36A]" /> Website
                </a>
              )}
            </div>
          </div>

          {/* Real Trust Verified Badges Bar */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
            {verifs.phone && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Phone Verified
              </span>
            )}
            {verifs.email && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Email Verified
              </span>
            )}
            {verifs.college && (
              <span className="px-3 py-1 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/40 flex items-center gap-1">
                🎓 College Verified
              </span>
            )}
            {verifs.linkedin && (
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center gap-1">
                <Linkedin className="w-3 h-3" /> LinkedIn Verified
              </span>
            )}
          </div>

          {/* Stats Bar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 border-t border-white/10 text-center">
            <div>
              <span className="block text-2xl font-black text-[#8B7CFF] font-mono">{profile.teachingHours || 0}</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Hours Taught</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-[#72C7FF] font-mono">{profile.learningHours || 0}</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Hours Learned</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-emerald-400 font-mono">{profile.trustScore || 90}%</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Trust Score</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-[#D6B36A] font-mono">{profile.responseRate || 98}%</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Response Rate</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-white font-mono">{profile.completedSessions || 0}</span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Completed Swaps</span>
            </div>
          </div>

        </div>
      </SpotlightCard>

      {/* Portfolio Projects Gallery */}
      <SpotlightCard level="elevated" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#8B7CFF]" /> Portfolio & Projects ({profile.portfolio?.length || 0})
          </h3>

          {isOwnProfile && (
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#8B7CFF]" /> Add Project
            </button>
          )}
        </div>

        {/* Add Project Form */}
        {showAddProject && (
          <form onSubmit={handleAddProject} className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 space-y-3">
            <h4 className="text-xs font-bold text-white">Add New Portfolio Project</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Project Title (e.g. E-Commerce App)"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#0D1524] border border-white/15 text-xs text-white"
              />
              <input
                type="url"
                placeholder="Project URL (e.g. https://github.com/...)"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#0D1524] border border-white/15 text-xs text-white"
              />
            </div>
            <textarea
              placeholder="Project Description..."
              rows={2}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0D1524] border border-white/15 text-xs text-white"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddProject(false)} className="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
              <button type="submit" className="px-4 py-1.5 rounded-xl accent-gradient-bg text-[#05070A] font-bold text-xs">Save Project</button>
            </div>
          </form>
        )}

        {/* Portfolio Cards Grid */}
        {profile.portfolio && profile.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.portfolio.map(proj => (
              <div key={proj._id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all space-y-2 relative group">
                {isOwnProfile && (
                  <button
                    onClick={() => handleDeleteProject(proj._id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <h4 className="font-extrabold text-sm text-white">{proj.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                {proj.projectUrl && (
                  <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-xs text-[#72C7FF] font-bold hover:underline inline-flex items-center gap-1 pt-1">
                    View Project <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No portfolio projects uploaded yet.</p>
        )}
      </SpotlightCard>

      {/* Skills Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpotlightCard level="elevated" className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8B7CFF]" /> Skills Offered (Teaches)
          </h3>
          <div className="space-y-2">
            {profile.teachSkills && profile.teachSkills.length > 0 ? (
              profile.teachSkills.map((s, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-[#8B7CFF]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#8B7CFF]">{s.skillId?.name}</span>
                    <span className="block text-[10px] text-slate-400">{s.skillId?.category}</span>
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

        <SpotlightCard level="elevated" className="p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#72C7FF]" /> Skills Wanted (Wants to Learn)
          </h3>
          <div className="space-y-2">
            {profile.learnSkills && profile.learnSkills.length > 0 ? (
              profile.learnSkills.map((s, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-[#72C7FF]/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#72C7FF]">{s.skillId?.name}</span>
                    <span className="block text-[10px] text-slate-400">{s.skillId?.category}</span>
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

      {/* Modals */}
      <ReportUserModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetUser={profile}
      />

      <VerificationModal
        isOpen={showVerifModal}
        onClose={() => setShowVerifModal(false)}
      />

    </div>
  );
};

export default Profile;
