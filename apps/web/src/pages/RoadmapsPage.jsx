import React, { useState, useEffect } from 'react';
import api from '../api/client';
import LiquidGlassCard from '../components/LiquidGlassCard';
import SkeletonCard from '../components/SkeletonCard';
import { Map, Plus, CheckCircle2, Circle, Sparkles, Layers, BookOpen, Trash2 } from 'lucide-react';

const RoadmapsPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');

  const fetchRoadmaps = async () => {
    try {
      const res = await api.get('/roadmaps');
      if (res.success) setRoadmaps(res.roadmaps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post('/roadmaps', { title, category, description });
      if (res.success) {
        setTitle('');
        setDescription('');
        setShowCreate(false);
        fetchRoadmaps();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStep = async (roadmapId, stepId) => {
    try {
      const res = await api.patch(`/roadmaps/${roadmapId}/steps/${stepId}`);
      if (res.success) fetchRoadmaps();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#72C7FF]/20 border border-[#72C7FF]/40 text-[#72C7FF] text-xs font-mono font-bold">
            <Map className="w-3.5 h-3.5 text-[#72C7FF]" /> INTERACTIVE LEARNING ROADMAPS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
            Skill <span className="accent-gradient-text">Roadmaps</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build custom step-by-step learning paths, track milestones, and conquer skills visually.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-3 rounded-2xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Custom Roadmap
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <LiquidGlassCard className="p-6 space-y-4 border border-[#8B7CFF]/40">
          <h3 className="text-lg font-black text-white">New Learning Roadmap</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Roadmap Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Web Development, UX Design Mastery..."
                className="w-full px-4 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
                >
                  <option value="Technology">Technology & Coding</option>
                  <option value="Design">Design & Creative</option>
                  <option value="Languages">Languages</option>
                  <option value="Music">Music & Arts</option>
                  <option value="Business">Business & Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-[#A1ACBC] mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short goal summary..."
                  className="w-full px-4 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl accent-gradient-bg text-[#05070A] font-black text-xs"
              >
                Save Roadmap 🎉
              </button>
            </div>
          </form>
        </LiquidGlassCard>
      )}

      {/* Roadmaps Grid */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : roadmaps.length === 0 ? (
        <LiquidGlassCard className="p-12 text-center space-y-3 border border-dashed border-white/15">
          <Map className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Learning Roadmaps Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ Create Custom Roadmap" to set your first visual learning pathway!
          </p>
        </LiquidGlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map(rm => {
            const completedCount = rm.steps.filter(s => s.completed).length;
            const totalCount = rm.steps.length;
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <LiquidGlassCard key={rm._id} className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#72C7FF]/20 text-[#72C7FF] text-[10px] font-extrabold uppercase border border-[#72C7FF]/30">
                    {rm.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    By {rm.userId?.name || 'Peer Mentor'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{rm.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{rm.description || 'Custom learning path'}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-[#8B7CFF]">{pct}% Completed</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full accent-gradient-bg transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Step List */}
                <div className="space-y-2.5 pt-2">
                  {rm.steps.map(step => (
                    <button
                      key={step._id}
                      onClick={() => handleToggleStep(rm._id, step._id)}
                      className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                        )}
                        <span className={`text-xs font-extrabold ${step.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {step.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default RoadmapsPage;
