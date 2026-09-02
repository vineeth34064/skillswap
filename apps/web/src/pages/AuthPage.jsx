import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import SpotlightCard from '../components/SpotlightCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import { Sparkles, Repeat, ArrowRight, AlertCircle, Lock, Mail, User, MapPin } from 'lucide-react';

const AuthPage = ({ onOpenOnboarding }) => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterInitial = location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isRegisterInitial);

  // Form Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('New York');
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isRegister) {
        const res = await login(email || username, password);
        if (res.success) {
          navigate('/dashboard');
        }
      } else {
        const res = await register({
          name,
          username,
          email,
          password,
          city,
          bio
        });
        if (res.success) {
          if (onOpenOnboarding) {
            onOpenOnboarding();
          }
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10 min-h-[80vh] flex flex-col justify-center">
      
      {/* Background Spatial Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#8B7CFF]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#72C7FF]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left Column: Spatial Network Teaser */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-premium border border-[#D6B36A]/50 text-[#D6B36A] text-xs font-bold shadow-gold-glow">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span>Exchange Skills, Not Money</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            Unlock the World's <br />
            <span className="accent-gradient-rare drop-shadow-[0_0_20px_rgba(214,179,106,0.4)]">Knowledge Network</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#B0BAC9] leading-relaxed max-w-lg">
            Swap your C++, Python, or Music skills directly for Photoshop, UI Design, or Languages. Earn Time Credits whenever you teach others.
          </p>

          {/* Liquid Glass Feature Cards */}
          <div className="space-y-4 pt-2">
            <LiquidGlassCard className="p-5 flex items-center justify-between border-white/15 bg-[#101827]/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl accent-gradient-bg flex items-center justify-center font-bold text-[#101827] shadow-glow">
                  <Repeat className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">Direct Reciprocal Swaps</h4>
                  <p className="text-xs sm:text-sm text-[#B0BAC9]">C++ ↔ Photoshop 1:1 Skill Exchanges</p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] text-xs font-mono font-extrabold border border-[#8B7CFF]/40">
                Direct
              </span>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5 flex items-center justify-between border-white/15 bg-[#101827]/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/40 flex items-center justify-center font-bold text-lg shadow-gold-glow">
                  ⚡
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">Time Credit System</h4>
                  <p className="text-xs sm:text-sm text-[#B0BAC9]">1 Hour Taught = 1 Time Credit Earned</p>
                </div>
              </div>
              <TimeCreditBadge credits={2.0} size="md" />
            </LiquidGlassCard>
          </div>

        </div>

        {/* Right Column: Full Liquid Glass Auth Form Card */}
        <div className="lg:col-span-6">
          <div className="p-8 sm:p-10 space-y-6 relative border border-white/20 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-3xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(139,124,255,0.15)] transition-all">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl liquid-glass-base border border-white/15 bg-white/[0.04] backdrop-blur-md">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  !isRegister
                    ? 'accent-gradient-bg text-[#101827] shadow-glow'
                    : 'text-[#B0BAC9] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  isRegister
                    ? 'accent-gradient-bg text-[#101827] shadow-glow'
                    : 'text-[#B0BAC9] hover:text-white'
                }`}
              >
                Create Account (+2.0 Credits)
              </button>
            </div>

            {/* Auth Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {!isRegister ? 'Welcome Back to SkillSwap' : 'Create Your SkillSwap Identity'}
              </h2>
              <p className="text-sm text-[#B0BAC9] mt-1.5">
                {!isRegister
                  ? 'Enter your email or username and password to access your Time Credits and sessions.'
                  : 'Join our digital knowledge exchange and claim 2.0 free Time Credits.'}
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-extrabold text-[#B0BAC9] mb-2">Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-[#B0BAC9] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Vineet Kumar"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-sm sm:text-base placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-extrabold text-[#B0BAC9] mb-2">Username</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. vineet_dev"
                        className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-sm sm:text-base placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-extrabold text-[#B0BAC9] mb-2">City / Location</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. New York"
                        className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-sm sm:text-base placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-[#B0BAC9] mb-2">
                  {isRegister ? 'Email Address' : 'Email or Username'}
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#B0BAC9] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isRegister ? 'vineet@example.com' : 'vineet@example.com or @vineet'}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-sm sm:text-base placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-[#B0BAC9] mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#B0BAC9] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-sm sm:text-base placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl accent-gradient-bg text-[#101827] font-black text-sm sm:text-base shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    <span>{!isRegister ? 'Sign In' : 'Create Account & Set Skills'}</span>
                    <Sparkles className="w-4 h-4 text-[#101827]" />
                  </>
                )}
              </button>

            </form>

            <div className="pt-4 border-t border-white/10 text-center text-xs sm:text-sm text-[#B0BAC9]">
              {!isRegister ? (
                <p>
                  New to SkillSwap?{' '}
                  <button
                    onClick={() => { setIsRegister(true); setError(''); }}
                    className="font-extrabold text-[#D6B36A] hover:underline cursor-pointer ml-1"
                  >
                    Create Account (+2.0 Free Credits)
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setIsRegister(false); setError(''); }}
                    className="font-extrabold text-[#D6B36A] hover:underline cursor-pointer ml-1"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AuthPage;
