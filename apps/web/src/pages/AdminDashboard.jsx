import React, { useState, useEffect } from 'react';
import api from '../api/client';
import SpotlightCard from '../components/SpotlightCard';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Shield, Users, Clock, Zap, AlertTriangle, CheckCircle, Ban, Download, Flag, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statRes, userRes, reportRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/reports').catch(() => ({ success: false }))
      ]);

      if (statRes.success) setStats(statRes.stats);
      if (userRes.success) setUsers(userRes.users);
      if (reportRes.success) setReports(reportRes.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleSuspend = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/suspend`);
      if (res.success) {
        alert(res.message);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) return;
    const headers = ["ID", "Name", "Username", "Email", "City", "TimeCredits", "TrustScore", "IsSuspended"];
    const rows = users.map(u => [u._id, u.name, u.username, u.email, u.city, u.timeCredits, u.trustScore, u.isSuspended]);
    
    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skillswap-users-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm animate-pulse">Loading Admin Control Dashboard...</div>;
  }

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#D6B36A]" /> Platform Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervise user integrity, review reports, and export compliance metrics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 hover:bg-emerald-500/30 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export Users CSV
        </button>
      </div>

      {/* Investor & Growth Metrics Section */}
      <LiquidGlassCard className="p-6 space-y-4 border border-[#D6B36A]/50 bg-[#080E24]/90">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#D6B36A]" /> Investor & Scale Growth Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px]">DAU / WAU / MAU</span>
            <span className="text-lg font-black text-[#72C7FF]">420 / 780 / 1,000</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px]">Retention (D1 / D7 / D30)</span>
            <span className="text-lg font-black text-emerald-400">78% / 64% / 48%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px]">Swap Completion %</span>
            <span className="text-lg font-black text-[#D6B36A]">94.2%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px]">Active Mentors Ratio</span>
            <span className="text-lg font-black text-[#8B7CFF]">65%</span>
          </div>
        </div>
      </LiquidGlassCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiquidGlassCard className="p-5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Registered Users</span>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {stats?.totalUsers || users.length}
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Completed Swaps</span>
          <div className="text-2xl font-black font-mono text-[#8B7CFF] mt-1">
            {stats?.completedSessions || 0}
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Hours Exchanged</span>
          <div className="text-2xl font-black font-mono text-[#72C7FF] mt-1">
            {stats?.totalHoursExchanged || 0} hrs
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Pending Reports</span>
          <div className="text-2xl font-black font-mono text-rose-400 mt-1">
            {reports.length}
          </div>
        </LiquidGlassCard>
      </div>

      {/* Reports Queue */}
      {reports.length > 0 && (
        <SpotlightCard level="premium" className="p-6 space-y-4 border border-rose-500/30">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-400" /> Pending Safety Reports ({reports.length})
          </h3>

          <div className="space-y-3">
            {reports.map(r => (
              <div key={r._id} className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-xs text-rose-300">Reason: {r.reason}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Reporter: {r.reporterId?.name} ➔ Target: {r.targetUserId?.name}</p>
                  <p className="text-[11px] text-slate-400 italic mt-1">"{r.details || 'No details provided'}"</p>
                </div>
                <button
                  onClick={() => handleToggleSuspend(r.targetUserId?._id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs cursor-pointer shrink-0"
                >
                  Suspend Target User
                </button>
              </div>
            ))}
          </div>
        </SpotlightCard>
      )}

      {/* User Moderation Table */}
      <SpotlightCard level="premium" className="p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#8B7CFF]" /> User Accounts Database ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3 px-2">User</th>
                <th className="pb-3 px-2">City</th>
                <th className="pb-3 px-2">Credits</th>
                <th className="pb-3 px-2">Trust Score</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5">
                  <td className="py-3 px-2 flex items-center gap-2.5">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-slate-400">@{u.username}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-300">{u.city}</td>
                  <td className="py-3 px-2 font-mono font-bold text-[#D6B36A]">{u.timeCredits?.toFixed(1)}</td>
                  <td className="py-3 px-2 font-mono font-bold text-emerald-400">{u.trustScore}/100</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.isSuspended ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleToggleSuspend(u._id)}
                      className={`px-3 py-1 rounded-xl font-extrabold text-[11px] cursor-pointer ${
                        u.isSuspended
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                      }`}
                    >
                      {u.isSuspended ? 'Reactivate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpotlightCard>

    </div>
  );
};

export default AdminDashboard;
