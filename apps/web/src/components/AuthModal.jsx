import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onCompleteOnboarding }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  
  // Form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('New York');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email || username, password);
        if (res.success) {
          onClose();
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
          onClose();
          if (onCompleteOnboarding) onCompleteOnboarding();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/[0.06] hover:bg-white/[0.08] backdrop-blur-3xl shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_35px_rgba(139,124,255,0.2)] overflow-hidden text-white transition-all">
        
        {/* Header gradient banner */}
        <div className="p-6 relative border-b border-white/10 bg-gradient-to-r from-[#8B7CFF]/15 via-transparent to-[#72C7FF]/15">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D6B36A] text-xs font-bold border border-[#D6B36A]/30 backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span>Exchange Skills, Not Money</span>
          </div>

          <h3 className="text-2xl font-extrabold font-sans text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Join SkillSwap'}
          </h3>
          <p className="text-xs text-[#A1ACBC] mt-1 font-medium">
            {mode === 'login'
              ? 'Access your Time Credits and connect with mentors.'
              : 'Sign up to get 2.0 Free Time Credits instantly!'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vineet Kumar"
                  className="w-full px-4 py-2.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. vineet_dev"
                  className="w-full px-4 py-2.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">City / Location</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full px-4 py-2.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {mode === 'register' ? 'Email Address' : 'Email or Username'}
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === 'register' ? 'vineet@example.com' : 'vineet@example.com or @vineet'}
              className="w-full px-4 py-2.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-2xl border border-white/20 bg-white/[0.04] text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B7CFF] focus:bg-white/[0.08] backdrop-blur-md transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 accent-gradient-bg text-[#05070A] font-extrabold rounded-2xl shadow-glow hover:scale-[1.02] transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account & Get 2.0 Credits'
            )}
          </button>

          <div className="pt-3 border-t border-white/10 text-center text-xs text-[#A1ACBC]">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#D6B36A] hover:underline cursor-pointer"
                >
                  Join now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#D6B36A] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default AuthModal;
