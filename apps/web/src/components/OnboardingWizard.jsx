import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Check, ArrowRight, Sparkles, Plus, X, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingWizard = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [availableSkills, setAvailableSkills] = useState([]);
  
  // Custom Skill input state
  const [customTeachInput, setCustomTeachInput] = useState('');
  const [customLearnInput, setCustomLearnInput] = useState('');

  // Selections
  const [teachSkills, setTeachSkills] = useState([]); // [{ skillId, name, level }]
  const [learnSkills, setLearnSkills] = useState([]); // [{ skillId, name, level }]
  const [learningMode, setLearningMode] = useState('Both');
  const [availability, setAvailability] = useState(['Saturday', 'Sunday']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/skills').then(res => {
        if (res.success) setAvailableSkills(res.skills);
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddCustomSkill = async (type) => {
    const rawInput = type === 'TEACH' ? customTeachInput.trim() : customLearnInput.trim();
    if (!rawInput) return;

    // Clear input box immediately (0ms latency)
    if (type === 'TEACH') setCustomTeachInput('');
    else setCustomLearnInput('');

    // Check if skill already exists in availableSkills (case insensitive)
    const existing = availableSkills.find(s => s.name.toLowerCase() === rawInput.toLowerCase());
    if (existing) {
      if (type === 'TEACH') {
        if (!teachSkills.some(s => s.skillId === existing._id)) {
          setTeachSkills(prev => [{ skillId: existing._id, name: existing.name, level: 'Intermediate' }, ...prev]);
        }
      } else {
        if (!learnSkills.some(s => s.skillId === existing._id)) {
          setLearnSkills(prev => [{ skillId: existing._id, name: existing.name, level: 'Beginner' }, ...prev]);
        }
      }
      return;
    }

    // Create instant local temp skill
    const tempId = 'temp-' + Date.now();
    const tempSkill = {
      _id: tempId,
      name: rawInput,
      category: 'Custom & Other',
      isCustom: true
    };

    // 1. INSTANT LOCAL UPDATE (0ms)
    setAvailableSkills(prev => [tempSkill, ...prev]);

    if (type === 'TEACH') {
      setTeachSkills(prev => [{ skillId: tempId, name: rawInput, level: 'Intermediate' }, ...prev]);
    } else {
      setLearnSkills(prev => [{ skillId: tempId, name: rawInput, level: 'Beginner' }, ...prev]);
    }

    // 2. Persist to Backend DB in background
    try {
      const res = await api.post('/skills/custom', {
        name: rawInput,
        category: 'Custom & Other',
        description: `Custom user skill: ${rawInput}`
      });

      if (res.success && res.skill) {
        const realSkill = res.skill;
        setAvailableSkills(prev => prev.map(s => s._id === tempId ? realSkill : s));
        if (type === 'TEACH') {
          setTeachSkills(prev => prev.map(s => s.skillId === tempId ? { ...s, skillId: realSkill._id } : s));
        } else {
          setLearnSkills(prev => prev.map(s => s.skillId === tempId ? { ...s, skillId: realSkill._id } : s));
        }
      }
    } catch (err) {
      console.error('Failed to create custom skill on backend:', err);
    }
  };

  const toggleTeachSkill = (skill) => {
    if (teachSkills.some(s => s.skillId === skill._id)) {
      setTeachSkills(teachSkills.filter(s => s.skillId !== skill._id));
    } else {
      setTeachSkills([...teachSkills, { skillId: skill._id, name: skill.name, level: 'Intermediate' }]);
    }
  };

  const toggleLearnSkill = (skill) => {
    if (learnSkills.some(s => s.skillId === skill._id)) {
      setLearnSkills(learnSkills.filter(s => s.skillId !== skill._id));
    } else {
      setLearnSkills([...learnSkills, { skillId: skill._id, name: skill.name, level: 'Beginner' }]);
    }
  };

  const toggleAvailability = (day) => {
    if (availability.includes(day)) {
      setAvailability(availability.filter(d => d !== day));
    } else {
      setAvailability([...availability, day]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // 1. Submit teach skills
      for (const skill of teachSkills) {
        await api.post('/users/skills', {
          skillId: skill.skillId,
          type: 'TEACH',
          level: skill.level || 'Intermediate'
        });
      }

      // 2. Submit learn skills
      for (const skill of learnSkills) {
        await api.post('/users/skills', {
          skillId: skill.skillId,
          type: 'LEARN',
          level: skill.level || 'Beginner'
        });
      }

      // 3. Update profile settings
      await api.patch('/users/profile', {
        learningMode,
        availability
      });

      await refreshUser();
      onClose();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md">
      <div className="w-full max-w-xl liquid-glass-base rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 space-y-6 relative bg-[#101827]/95">
        
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#A1ACBC] hover:text-white transition-colors cursor-pointer"
          title="Close / Skip for now"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-[#A1ACBC] pr-8">
          <span>STEP {step} OF 3</span>
          <span className="text-[#8B7CFF]">Onboarding Profile Setup</span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="accent-gradient-bg h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: What can you teach? */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">What can you teach?</h3>
              <p className="text-xs text-[#A1ACBC] mt-1">Select from popular skills or type ANY custom skill in the world!</p>
            </div>

            {/* Custom Skill Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTeachInput}
                onChange={(e) => setCustomTeachInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill('TEACH'); } }}
                placeholder="Type custom skill (e.g. Cloud Computing, Pottery, Rust)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl liquid-glass-base border border-white/10 text-white text-xs bg-[#05070A] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
              />
              <button
                type="button"
                onClick={() => handleAddCustomSkill('TEACH')}
                disabled={!customTeachInput.trim()}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-[#D6B36A] font-extrabold text-xs rounded-xl border border-[#D6B36A]/40 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
              >
                + Add Custom
              </button>
            </div>

            {/* SELECTED SKILLS CHIP BAR */}
            {teachSkills.length > 0 && (
              <div className="p-3 rounded-2xl bg-[#8B7CFF]/10 border border-[#8B7CFF]/30 space-y-2">
                <div className="text-[11px] font-mono text-[#8B7CFF] font-extrabold uppercase flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Skills You'll Teach ({teachSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {teachSkills.map((s) => (
                    <span
                      key={s.skillId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B7CFF]/20 text-white text-xs font-bold border border-[#8B7CFF]/40"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => setTeachSkills(teachSkills.filter(item => item.skillId !== s.skillId))}
                        className="hover:text-rose-400 p-0.5 rounded-full cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
              {availableSkills.map((skill) => {
                const isSelected = teachSkills.some(s => s.skillId === skill._id);
                return (
                  <button
                    key={skill._id}
                    onClick={() => toggleTeachSkill(skill)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#8B7CFF] bg-[#8B7CFF]/20 text-[#8B7CFF] font-extrabold shadow-glow'
                        : 'border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{skill.name}</span>
                      {isSelected ? <Check className="w-3.5 h-3.5 text-[#8B7CFF]" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <span className="text-[10px] text-[#A1ACBC] mt-2">{skill.category}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-[#A1ACBC] hover:text-white transition-colors cursor-pointer"
              >
                Skip for now
              </button>

              <button
                onClick={() => setStep(2)}
                disabled={teachSkills.length === 0}
                className="px-5 py-2.5 accent-gradient-bg text-[#05070A] rounded-xl text-xs font-extrabold shadow-glow disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                Next: What to Learn <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: What do you want to learn? */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">What do you want to learn?</h3>
              <p className="text-xs text-[#A1ACBC] mt-1">Select skills you wish to learn from community mentors.</p>
            </div>

            {/* Custom Skill Input for LEARN */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customLearnInput}
                onChange={(e) => setCustomLearnInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill('LEARN'); } }}
                placeholder="Type custom skill to learn (e.g. AI Prompting, Piano, Yoga)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl liquid-glass-base border border-white/10 text-white text-xs bg-[#05070A] focus:outline-none focus:ring-2 focus:ring-[#72C7FF]"
              />
              <button
                type="button"
                onClick={() => handleAddCustomSkill('LEARN')}
                disabled={!customLearnInput.trim()}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-[#72C7FF] font-extrabold text-xs rounded-xl border border-[#72C7FF]/40 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
              >
                + Add Custom
              </button>
            </div>

            {/* SELECTED SKILLS CHIP BAR (LEARN) */}
            {learnSkills.length > 0 && (
              <div className="p-3 rounded-2xl bg-[#72C7FF]/10 border border-[#72C7FF]/30 space-y-2">
                <div className="text-[11px] font-mono text-[#72C7FF] font-extrabold uppercase flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Skills You'll Learn ({learnSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {learnSkills.map((s) => (
                    <span
                      key={s.skillId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72C7FF]/20 text-white text-xs font-bold border border-[#72C7FF]/40"
                    >
                      <span>{s.name}</span>
                      <button
                        type="button"
                        onClick={() => setLearnSkills(learnSkills.filter(item => item.skillId !== s.skillId))}
                        className="hover:text-rose-400 p-0.5 rounded-full cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
              {availableSkills.map((skill) => {
                const isSelected = learnSkills.some(s => s.skillId === skill._id);
                return (
                  <button
                    key={skill._id}
                    onClick={() => toggleLearnSkill(skill)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#72C7FF] bg-[#72C7FF]/20 text-[#72C7FF] font-extrabold shadow-blue-glow'
                        : 'border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{skill.name}</span>
                      {isSelected ? <Check className="w-3.5 h-3.5 text-[#72C7FF]" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                    </div>
                    <span className="text-[10px] text-[#A1ACBC] mt-2">{skill.category}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                Back
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-bold text-[#A1ACBC] hover:text-white transition-colors cursor-pointer"
                >
                  Skip
                </button>

                <button
                  onClick={() => setStep(3)}
                  disabled={learnSkills.length === 0}
                  className="px-5 py-2.5 accent-gradient-bg text-[#05070A] rounded-xl text-xs font-extrabold shadow-glow disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  Next: Preferences <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences & Availability */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">Learning Preference</h3>
              <p className="text-xs text-[#A1ACBC] mt-1">Choose how you prefer to meet your skill swap partners.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['Online', 'In person', 'Both'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLearningMode(mode)}
                  className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer ${
                    learningMode === mode
                      ? 'border-[#8B7CFF] bg-[#8B7CFF]/20 text-white shadow-glow'
                      : 'border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2">Weekly Availability</h4>
              <div className="grid grid-cols-4 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const isAvail = availability.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleAvailability(day)}
                      className={`py-2 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                        isAvail
                          ? 'border-[#D6B36A] bg-[#D6B36A]/20 text-[#D6B36A] shadow-gold-glow'
                          : 'border-white/10 text-[#A1ACBC]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-bold text-[#A1ACBC] hover:text-white transition-colors cursor-pointer"
                >
                  Skip
                </button>

                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="px-6 py-2.5 accent-gradient-bg text-[#05070A] rounded-xl text-xs font-black shadow-glow flex items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Saving Profile...' : 'Complete & Start Swapping! 🎉'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingWizard;
