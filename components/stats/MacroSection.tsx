'use client';

import React from 'react';

interface MacroData {
  label: string;
  current: number;
  target: number;
  icon: string;
  color: string;
}

interface MacroSectionProps {
  title?: string;
  macros: MacroData[];
}

export default function MacroSection({
  title = 'Dinh dưỡng trung bình',
  macros,
}: MacroSectionProps) {
  return (
    <div className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-lg rounded-[24px] p-6">
      <h3 className="text-[18px] font-bold text-[#005239] mb-6">{title}</h3>

      <div className="space-y-6">
        {macros.map((macro) => {
          const percentage = Math.min((macro.current / macro.target) * 100, 100);

          return (
            <div key={macro.label}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ color: macro.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {macro.icon}
                  </span>
                  <span className="font-medium text-[#005239]">{macro.label}</span>
                </div>
                <span className="text-sm font-semibold text-[#005239] font-['Space_Grotesk']">
                  {Math.round(macro.current)}/{macro.target}g
                </span>
              </div>

              <div className="h-2 bg-[#caeadd] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: macro.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
