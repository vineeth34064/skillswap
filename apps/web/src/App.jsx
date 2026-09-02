import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import GlassDockNavbar from './components/GlassDockNavbar';
import AuthModal from './components/AuthModal';
import OnboardingWizard from './components/OnboardingWizard';
import AmbientBackground from './components/AmbientBackground';
import CmdKModal from './components/CmdKModal';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Sessions from './pages/Sessions';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import RequestsPage from './pages/RequestsPage';
import WalletPage from './pages/WalletPage';
import RoadmapsPage from './pages/RoadmapsPage';
import ReelsPage from './pages/ReelsPage';
import SettingsPage from './pages/SettingsPage';
import SafetyCenterPage from './pages/SafetyCenterPage';
import LegalPrivacyPage from './pages/LegalPrivacyPage';
import CommunityPage from './pages/CommunityPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReferralPage from './pages/ReferralPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const AppRoutes = ({ onOpenAuth, onOpenOnboarding }) => {
  const { user } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={user ? <Dashboard onOpenOnboarding={onOpenOnboarding} /> : <LandingPage onOpenAuth={onOpenAuth} />} />
        <Route path="/login" element={<AuthPage onOpenOnboarding={onOpenOnboarding} />} />
        <Route path="/register" element={<AuthPage onOpenOnboarding={onOpenOnboarding} />} />
        <Route path="/dashboard" element={user ? <Dashboard onOpenOnboarding={onOpenOnboarding} /> : <Navigate to="/" />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/matches" element={user ? <Matches /> : <Navigate to="/" />} />
        <Route path="/requests" element={user ? <RequestsPage /> : <Navigate to="/" />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/sessions" element={user ? <Sessions /> : <Navigate to="/" />} />
        <Route path="/wallet" element={user ? <WalletPage /> : <Navigate to="/" />} />
        <Route path="/roadmaps" element={user ? <RoadmapsPage /> : <Navigate to="/" />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/" />} />
        <Route path="/safety" element={<SafetyCenterPage />} />
        <Route path="/privacy" element={<LegalPrivacyPage />} />
        <Route path="/terms" element={<LegalPrivacyPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/analytics" element={user ? <AnalyticsPage /> : <Navigate to="/" />} />
        <Route path="/referrals" element={user ? <ReferralPage /> : <Navigate to="/" />} />
        <Route path="/verify-certificate/:certId" element={<VerifyCertificatePage />} />
        <Route path="/admin" element={user && (user.isAdmin || user.role === 'ADMIN') ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SkillSwap UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#080E24] text-white p-6 text-center">
          <div className="max-w-md space-y-4 p-8 rounded-3xl bg-[#101827] border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-black text-[#72C7FF]">SkillSwap Application Reset</h2>
            <p className="text-xs text-slate-300">
              {this.state.error?.message || 'An unexpected rendering error occurred. Click below to reload your session.'}
            </p>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="px-6 py-3 rounded-2xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all cursor-pointer"
            >
              Reload & Reset Session 🔄
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [cmdKOpen, setCmdKOpen] = useState(false);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080E24] text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#8B7CFF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-extrabold text-[#72C7FF] tracking-wider uppercase">Loading SkillSwap V4...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080E24] text-[#F7F9FC] relative selection:bg-[#8B7CFF] selection:text-white">
      <AmbientBackground />
      
      <GlassDockNavbar
        onOpenAuth={handleOpenAuth}
        onOpenCmdK={() => setCmdKOpen(true)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
      />

      <main className="flex-1 relative z-10 pt-16 sm:pt-20 pb-12 w-full">
        <AppRoutes onOpenAuth={handleOpenAuth} onOpenOnboarding={() => setOnboardingOpen(true)} />
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onCompleteOnboarding={() => setOnboardingOpen(true)}
      />

      <OnboardingWizard
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />

      <CmdKModal
        isOpen={cmdKOpen}
        onClose={() => setCmdKOpen(false)}
      />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
