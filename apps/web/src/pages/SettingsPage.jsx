import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Settings, Moon, Bell, Shield, UserX, Download, Trash2, Globe, Clock, Check, AlertTriangle, LogOut } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  
  const [emailNotifs, setEmailNotifs] = useState(user?.settings?.emailNotifications ?? true);
  const [pushNotifs, setPushNotifs] = useState(user?.settings?.pushNotifications ?? true);
  const [privateProfile, setPrivateProfile] = useState(user?.settings?.privateProfile ?? false);
  const [timezone, setTimezone] = useState(user?.settings?.timezone || 'UTC');

  const [savedMsg, setSavedMsg] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleSaveSettings = async () => {
    try {
      const res = await api.put('/users/settings', {
        settings: {
          emailNotifications: emailNotifs,
          pushNotifications: pushNotifs,
          privateProfile,
          timezone
        }
      });
      if (res.success) {
        await refreshUser();
        setSavedMsg('Settings saved successfully! 🎉');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await api.get('/users/export');
      if (res.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.exportData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `skillswap-data-${user.username}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      alert(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('CRITICAL WARNING: Are you sure you want to permanently delete your SkillSwap account? All data, skills, and credits will be purged.')) return;
    try {
      const res = await api.delete('/users/account');
      if (res.success) {
        logout();
        navigate('/');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-[96%] sm:max-w-[90%] xl:max-w-[1000px] mx-auto px-4 py-6 space-y-8 relative z-10 text-white">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
          <Settings className="w-3.5 h-3.5 text-[#8B7CFF]" /> ACCOUNT & PRIVACY SETTINGS
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
          Platform <span className="accent-gradient-text">Settings</span>
        </h1>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Settings Options List */}
      <div className="space-y-6">
        
        {/* Notifications & Preferences */}
        <LiquidGlassCard className="p-6 space-y-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8B7CFF]" /> Notifications & Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Email Notifications</h4>
                <p className="text-[10px] text-slate-400">Receive session reminders and swap requests via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 accent-[#8B7CFF] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Real-Time Push Alerts</h4>
                <p className="text-[10px] text-slate-400">Instant WebSocket notification alerts for new messages</p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 accent-[#8B7CFF] cursor-pointer"
              />
            </div>
          </div>
        </LiquidGlassCard>

        {/* Privacy & Blocked Users */}
        <LiquidGlassCard className="p-6 space-y-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#72C7FF]" /> Privacy & Security
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Private Profile</h4>
                <p className="text-[10px] text-slate-400">Hide profile from un-registered public visitors</p>
              </div>
              <input
                type="checkbox"
                checked={privateProfile}
                onChange={(e) => setPrivateProfile(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 accent-[#72C7FF] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-xs font-bold text-white">Timezone</h4>
                <p className="text-[10px] text-slate-400">Used for session calendar scheduling</p>
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="px-3 py-2 rounded-xl liquid-glass-base border border-white/20 bg-[#0D1524] text-xs text-white"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="IST">IST (Indian Standard Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </LiquidGlassCard>

        {/* Data & Play Store Compliance */}
        <LiquidGlassCard className="p-6 space-y-5 border border-rose-500/20">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-rose-400" /> Data Safety & Play Store Compliance
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={handleExportData}
              disabled={exporting}
              className="flex-1 p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 text-[#72C7FF]" />
              <span>{exporting ? 'Preparing Export...' : 'Export My Account Data (.json)'}</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="flex-1 p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Permanently Delete Account</span>
            </button>
          </div>
        </LiquidGlassCard>

        {/* Active Session Logout Card */}
        <LiquidGlassCard className="p-6 space-y-4 border border-rose-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <LogOut className="w-5 h-5 text-rose-400" /> Active Session Logout
              </h3>
              <p className="text-xs text-slate-400 mt-1">Sign out of your current session on this device safely.</p>
            </div>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" /> Logout of Current Session
            </button>
          </div>
        </LiquidGlassCard>

      </div>

    </div>
  );
};

export default SettingsPage;
