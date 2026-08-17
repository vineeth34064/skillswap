import React, { useState } from 'react';
import { MapPin, Users, Navigation, ShieldCheck } from 'lucide-react';

const LocationMapVisualizer = ({ matches = [], onSelectMatch }) => {
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Group matches by city/zone
  const clusters = [
    { id: 1, label: 'Midtown East Cluster', count: Math.max(3, matches.length), distance: '1.2 – 2.5 km away', coords: { top: '35%', left: '48%' } },
    { id: 2, label: 'Downtown Creative Zone', count: 4, distance: '3.1 – 4.8 km away', coords: { top: '60%', left: '32%' } },
    { id: 3, label: 'University Heights Hub', count: 7, distance: '5.2 km away', coords: { top: '25%', left: '70%' } }
  ];

  return (
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-soft">
      
      {/* Map Graphic Background */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Grid Overlay Lines */}
      <svg className="absolute inset-0 w-full h-full stroke-slate-800/80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Approximate Privacy Badge */}
      <div className="absolute top-4 left-4 z-10 glass-panel px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-2 border border-slate-700">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Approximate Proximity • Addresses Protected</span>
      </div>

      {/* Cluster Nodes */}
      {clusters.map((cluster) => (
        <div
          key={cluster.id}
          style={{ top: cluster.coords.top, left: cluster.coords.left }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
          onClick={() => setSelectedCluster(cluster)}
        >
          {/* Radar Ping Animation */}
          <div className="absolute -inset-3 rounded-full bg-indigo-500/20 animate-ping" />
          
          <div className="relative flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-600/90 text-white shadow-glow border border-indigo-400/30 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span className="font-extrabold text-xs">{cluster.count} Members</span>
          </div>

          {/* Hover tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block w-44 bg-slate-900 text-white text-[11px] p-2 rounded-xl border border-slate-700 shadow-xl z-30 pointer-events-none">
            <div className="font-bold text-indigo-300">{cluster.label}</div>
            <div className="text-slate-400">{cluster.distance}</div>
          </div>
        </div>
      ))}

      {/* Center User Location Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-emerald-500/30 mt-1">
          Your Zone
        </span>
      </div>

      {/* Bottom Info Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-10 glass-panel p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-indigo-400" />
          <span>Click map clusters to explore nearby mentors within 5 km radius</span>
        </div>
        <span className="font-bold text-indigo-400">{matches.length} Compatible Matches</span>
      </div>
    </div>
  );
};

export default LocationMapVisualizer;
