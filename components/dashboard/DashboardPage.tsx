// ── COMPONENT: DASHBOARD PAGE ───────────────────────────────────────────────
'use client';

import React, { useEffect, useState } from 'react';
import { useDiaryStore } from '@/store/diaryStore';
import Link from 'next/link';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { currentLog, loadLog } = useDiaryStore();

  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().slice(0, 10);
    loadLog(today);
  }, [loadLog]);

  if (!mounted) return null;

  // ── DỮ LIỆU THỰC TẾ TỪ STORE ───────────────────────────────────────
  const TARGET = 2480; 
  const consumed = currentLog?.totalCalories || 0;
  const remaining = Math.max(TARGET - consumed, 0);
  const progress = Math.min((consumed / TARGET) * 100, 100);
  const dashOffset = 552.9 - (552.9 * progress) / 100;

  // Tính Macros thực tế
  const macros = currentLog?.meals.reduce((acc, meal) => {
    meal.ingredients.forEach(ing => {
      acc.p += ing.protein || 0;
      acc.c += ing.carbs || 0;
      acc.f += ing.fat || 0;
    });
    return acc;
  }, { p: 0, c: 0, f: 0 }) || { p: 0, c: 0, f: 0 };

  const macroTargets = { p: 120, c: 250, f: 65 };

  return (
    <div className="bg-[#f4fbf6] text-[#161d1a] font-['Be_Vietnam_Pro'] min-h-screen">
      {/* Link Material Symbols */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-900/10 h-16 flex justify-between items-center px-5 max-w-[700px] mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#005239] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <h1 className="text-[24px] font-bold text-[#005239] tracking-tight">CaloMate</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#caeadd] px-3 py-1 rounded-full text-[#4d6a60]">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            <span className="text-[12px] font-medium uppercase tracking-wider font-['Space_Grotesk']">5 ngày</span>
          </div>
          <button className="hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-[#005239]">settings</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-5 max-w-[700px] mx-auto space-y-6">
        {/* Date Navigation */}
        <nav className="flex items-center justify-between px-2">
          <button className="p-2 hover:bg-[#e8f0eb] rounded-full transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-[24px] font-semibold text-[#005239]">Hôm nay</h2>
          <button className="p-2 hover:bg-[#e8f0eb] rounded-full transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </nav>

        {/* Main Calories Progress Card */}
        <section className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-lg rounded-[32px] p-8 flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-[#caeadd]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
              <circle 
                className="text-[#005239] transition-all duration-500 ease-out" 
                cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" 
                strokeDasharray="552.9" 
                strokeDashoffset={dashOffset} 
                strokeWidth="12" 
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[40px] font-bold text-[#005239] font-['Space_Grotesk'] leading-none">
                {remaining.toLocaleString()}
              </span>
              <span className="text-[12px] font-medium text-[#6f7973] uppercase tracking-[0.05em] font-['Space_Grotesk']">kcal còn lại</span>
            </div>
          </div>

          {/* Macro Bars */}
          <div className="w-full grid grid-cols-3 gap-4 mt-2">
            {[
              { label: 'Carbs', current: macros.c, target: macroTargets.c },
              { label: 'Protein', current: macros.p, target: macroTargets.p },
              { label: 'Fat', current: macros.f, target: macroTargets.f },
            ].map((m) => (
              <div key={m.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[12px] font-medium text-[#005239] font-['Space_Grotesk']">{m.label}</span>
                  <span className="text-[10px] font-semibold">{Math.round(m.current)}/{m.target}g</span>
                </div>
                <div className="h-1.5 w-full bg-[#caeadd] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#005239] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Water Tracker Section */}
        <section className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-lg rounded-[32px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[18px] font-bold text-[#005239]">Uống nước</h3>
            <span className="font-semibold text-[#005239] font-['Space_Grotesk']">1,250 / 2,000 ml</span>
          </div>
          <div className="flex justify-between items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <span 
                key={i} 
                className={`material-symbols-outlined text-3xl ${i <= 5 ? 'text-[#005239]' : 'text-[#6f7973]/30'}`}
                style={{ fontVariationSettings: i <= 5 ? "'FILL' 1" : "'FILL' 0" }}
              >
                water_full
              </span>
            ))}
          </div>
        </section>

        {/* Meal Cards Section */}
        <section className="space-y-4">
          <h3 className="text-[18px] font-bold text-[#005239] px-2">Bữa ăn hôm nay</h3>
          
          {currentLog?.meals.map((meal) => (
            <div key={meal.id} className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-sm rounded-[24px] p-4 flex items-center gap-4 transition-transform active:scale-[0.98]">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f0eb] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#005239]">restaurant</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#005239] capitalize">{meal.mealType}</h4>
                    <p className="text-sm text-[#6f7973]">{meal.ingredients.length} món ăn • {meal.time}</p>
                  </div>
                  <span className="font-bold text-[#005239] font-['Space_Grotesk']">{meal.totalCalories} kcal</span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty Dinner Slot Example */}
          <Link href="/diary" className="bg-white/50 border-2 border-dashed border-[#bec9c1] rounded-[24px] p-4 flex items-center gap-4 opacity-70 hover:opacity-100 transition-all block text-decoration-none">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#bec9c1] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#6f7973]">add</span>
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-[#005239]/60">Thêm bữa ăn</h4>
              <p className="text-sm text-[#6f7973]/60">Ghi lại nhật ký ăn uống ngay</p>
            </div>
          </Link>
        </section>
      </main>

      {/* Floating Action Button (FAB) */}
      <Link href="/diary" className="fixed bottom-28 right-6 w-14 h-14 bg-[#005239] text-white rounded-[20px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-[700px] mx-auto bg-white/80 backdrop-blur-xl rounded-t-[32px] border-t border-emerald-900/10 shadow-2xl flex justify-around items-center px-6 pb-8 pt-4">
        <Link href="/" className="flex flex-col items-center gap-1 bg-emerald-100 text-[#002115] rounded-full p-3 scale-110 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        </Link>
        <Link href="/diary" className="flex flex-col items-center gap-1 text-[#005239]/40 p-3 hover:bg-emerald-50 rounded-full transition-all">
          <span className="material-symbols-outlined">menu_book</span>
        </Link>
        <Link href="/stats" className="flex flex-col items-center gap-1 text-[#005239]/40 p-3 hover:bg-emerald-50 rounded-full transition-all">
          <span className="material-symbols-outlined">bar_chart</span>
        </Link>
      </nav>
    </div>
  );
}