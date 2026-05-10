'use client';

import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'emerald' | 'blue' | 'orange' | 'pink';
}

export default function StatCard({
  icon,
  label,
  value,
  subtext,
  color = 'emerald',
}: StatCardProps) {
  const colorMap = {
    emerald: '#005239',
    blue: '#0066cc',
    orange: '#ff6b35',
    pink: '#ff006e',
  };

  const bgColorMap = {
    emerald: '#e8f0eb',
    blue: '#e8f2ff',
    orange: '#ffe8d9',
    pink: '#ffe8f5',
  };

  return (
    <div className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-sm rounded-[20px] p-5 flex items-start gap-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgColorMap[color] }}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ color: colorMap[color], fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#6f7973] font-medium">{label}</p>
        <p className="text-[22px] font-bold text-[#005239] font-['Space_Grotesk']">
          {value}
        </p>
        {subtext && <p className="text-xs text-[#9db5ab] mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
