import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const GlassSelect = ({ value, onChange, options = [], label = '' }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 rounded-2xl liquid-glass-base border border-white/20 text-white font-bold text-sm bg-[#0D1219]/90 hover:bg-[#0D1219] flex items-center justify-between transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]/50"
      >
        <span>{selectedOption?.label || selectedOption?.value || value}</span>
        <ChevronDown className={`w-4 h-4 text-[#8B7CFF] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl liquid-glass-base bg-[#0D1219]/95 backdrop-blur-2xl border border-white/25 shadow-2xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#8B7CFF]/25 text-[#8B7CFF]'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{opt.label || opt.value}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#8B7CFF]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GlassSelect;
