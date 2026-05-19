'use client';

import React, { useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import SettingsModal from "@/components/SettingsModal";

export function AppHeader() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Chỉ đọc từ Zustand store — profile đã được load bởi từng trang (Dashboard/Diary/Stats)
  const profile = useProfileStore((state) => state.profile);

  const currentStreak = profile?.currentStreak ?? 0;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-900/10 h-14 flex justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-[1100px] flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="material-symbols-outlined filled-icon text-primary text-2xl">
            local_fire_department
          </span>
          <h1 className="font-h1 text-xl sm:text-2xl text-primary font-black tracking-tight">
            CaloMate
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-primary-fixed-dim/30 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined filled-icon text-primary text-base">
              local_fire_department
            </span>
            <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-primary">
              Chuỗi <span className="font-numbers">{currentStreak}</span> ngày
            </span>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="hover:bg-surface-container transition-all active:scale-95 p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">
              settings
            </span>
          </button>
        </div>
      </div>
    </header>
    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
