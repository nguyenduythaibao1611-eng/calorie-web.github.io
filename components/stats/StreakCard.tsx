'use client';

import React from 'react';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  lastActive: string;
}

export default function StreakCard({
  currentStreak,
  bestStreak,
  lastActive,
}: StreakCardProps) {
  return (
    <div className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-lg rounded-[24px] p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[18px] font-bold text-[#005239]">Chuỗi liên tục</h3>
          <p className="text-sm text-[#6f7973] mt-1">Duy trì sự nhất quán</p>
        </div>
        <span
          className="material-symbols-outlined text-3xl text-orange-500"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          local_fire_department
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#e8f0eb] rounded-[16px] p-4 text-center">
          <p className="text-sm text-[#6f7973] font-medium mb-2">Hiện tại</p>
          <p className="text-[32px] font-bold text-[#005239] font-['Space_Grotesk']">
            {currentStreak}
          </p>
          <p className="text-xs text-[#9db5ab] mt-1">ngày liên tục</p>
        </div>

        <div className="bg-[#e8f0eb] rounded-[16px] p-4 text-center">
          <p className="text-sm text-[#6f7973] font-medium mb-2">Kỷ lục</p>
          <p className="text-[32px] font-bold text-[#005239] font-['Space_Grotesk']">
            {bestStreak}
          </p>
          <p className="text-xs text-[#9db5ab] mt-1">ngày</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#caeadd]">
        <p className="text-sm text-[#6f7973]">
          <span className="font-medium">Lần cuối:</span> {lastActive}
        </p>
      </div>
    </div>
  );
}
