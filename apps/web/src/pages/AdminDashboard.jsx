import React, { useState, useEffect } from 'react';
import api from '../api/client';
import SpotlightCard from '../components/SpotlightCard';
import { Shield, Users, Clock, Zap, AlertTriangle, CheckCircle, Ban, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statRes, userRes, disputeRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/disputes')
      ]);

      if (statRes.success) setStats(statRes.stats);
      if (userRes.success) setUsers(userRes.users);
      if (disputeRes.success) setDisputes(disputeRes.disputes);
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

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm animate-pulse">Loading Admin Control Dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 relative z-10">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#D6B36A]" /> Platform Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Supervise user integrity, resolve session disputes, and maintain platform health.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <SpotlightCard level="elevated" className="p-5">
          <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider">Total Registered Users</span>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {stats?.totalUsers || 0}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">{stats?.activeUsers || 0} Active</span>
        </SpotlightCard>

        <SpotlightCard level="elevated" className="p-5">
          <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider">Completed Sessions</span>
          <div className="text-2xl font-extrabold font-mono text-[#8B7CFF] mt-1">
            {stats?.completedSessions || 0} / {stats?.totalSessions || 0}
          </div>
          <span className="text-[11px] text-[#94A3B8]">Total exchanges</span>
        </SpotlightCard>

        <SpotlightCard level="elevated" className="p-5">
          <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider">Hours Exchanged</span>
          <div className="text-2xl font-extrabold font-mono text-[#72C7FF] mt-1">
            {stats?.totalHoursExchanged || 0} hrs
          </div>
          <span className="text-[11px] text-[#94A3B8]">Time economy volume</span>
        </SpotlightCard>

        <SpotlightCard level="elevated" className="p-5">
          <span className="text-[10px] text-[#94A3B8] font-extrabold uppercase tracking-wider">Open Disputes</span>
          <div className="text-2xl font-extrabold font-mono text-[#D6B36A] mt-1">
            {stats?.openDisputes || 0}
          </div>
          <span className="text-[11px] text-[#94A3B8]">Requires moderation</span>
        </SpotlightCard>

      </div>

      {/* User Moderation Table */}
      <SpotlightCard level="premium" className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#8B7CFF]" /> User Accounts ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#94A3B8] uppercase font-bold text-[10px]">
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
                      <div className="text-[#94A3B8]">@{u.username}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-300">{u.city}</td>
                  <td className="py-3 px-2 font-mono font-bold text-[#D6B36A]">{u.timeCredits?.toFixed(1)}</td>
                  <td className="py-3 px-2 font-mono font-bold text-emerald-400">{u.trustScore}/100</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.isSuspended ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleToggleSuspend(u._id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                        u.isSuspended
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-950/80 text-red-400 border border-red-800 hover:bg-red-900/80'
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
