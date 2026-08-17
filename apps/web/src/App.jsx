import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import GlassDockNavbar from './components/GlassDockNavbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import OnboardingWizard from './components/OnboardingWizard';
import AmbientBackground from './components/AmbientBackground';
import ScrollProgressBar from './components/ScrollProgressBar';
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

const AppRoutes = ({ onOpenAuth, onOpenOnboarding }) => {
  const { user } = useAuth();

  return (
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
      <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/admin" element={user && user.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const AppContent = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [cmdKOpen, setCmdKOpen] = useState(false);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080E24] text-[#F7F9FC] relative selection:bg-[#8B7CFF] selection:text-white">
      <ScrollProgressBar />
      <AmbientBackground />
      
      <GlassDockNavbar
        onOpenAuth={handleOpenAuth}
        onOpenCmdK={() => setCmdKOpen(true)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
      />

      <main className="flex-1 relative z-10 pt-28 pb-16 w-full">
        <AppRoutes onOpenAuth={handleOpenAuth} onOpenOnboarding={() => setOnboardingOpen(true)} />
      </main>

      <Footer />

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
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
