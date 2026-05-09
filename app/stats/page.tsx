'use client';

import React, { useEffect, useState } from 'react';
import { useDiaryStore } from '@/store/diaryStore';
import {
  WeeklyChart,
  StatCard,
  MacroSection,
  StreakCard,
} from '@/components/stats';
import Link from 'next/link';

// Mock data cho 7 ngày
const generateMockWeeklyData = () => {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
    });

    data.push({
      date: dateStr,
      calories: Math.floor(Math.random() * 800) + 1700, // 1700-2500 kcal
      target: 2480,
    });
  }

  return data;
};

// Mock macro data cho 7 ngày trung bình
const generateMockMacroStats = () => {
  return [
    {
      label: 'Protein',
      current: 95,
      target: 120,
      icon: 'egg',
      color: '#ff6b35',
    },
    {
      label: 'Carbs',
      current: 280,
      target: 310,
      icon: 'breakfast_dining',
      color: '#0066cc',
    },
    {
      label: 'Fat',
      current: 58,
      target: 65,
      icon: 'oil',
      color: '#ff006e',
    },
  ];
};

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const { currentLog } = useDiaryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const weeklyData = generateMockWeeklyData();
  const macroStats = generateMockMacroStats();

  // Tính toán thống kê cơ bản
  const avgCalories = Math.round(
    weeklyData.reduce((sum, d) => sum + d.calories, 0) / weeklyData.length
  );
  const totalDaysLogged = 23; // Mock data
  const currentStreak = 5;
  const bestStreak = 12;
  const lastActive = 'Hôm nay lúc 18:30';

  return (
    <div className="bg-[#f4fbf6] text-[#161d1a] font-['Be_Vietnam_Pro'] min-h-screen">
      {/* Link Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-900/10 h-16 flex justify-between items-center px-5 max-w-[700px] mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/">
            <button className="p-2 hover:bg-[#e8f0eb] rounded-full transition-colors">
              <span className="material-symbols-outlined text-[#005239]">
                chevron_left
              </span>
            </button>
          </Link>
          <h1 className="text-[24px] font-bold text-[#005239] tracking-tight">
            Thống kê
          </h1>
        </div>
      </header>

      <main className="pt-24 pb-32 px-5 max-w-[700px] mx-auto space-y-6">
        {/* Quick Stats */}
        <section className="grid grid-cols-2 gap-4">
          <StatCard
            icon="local_fire_department"
            label="Trung bình/ngày"
            value={avgCalories}
            subtext="kcal"
            color="emerald"
          />
          <StatCard
            icon="calendar_today"
            label="Ngày ghi nhật ký"
            value={totalDaysLogged}
            subtext="ngày"
            color="blue"
          />
        </section>

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />

        {/* Macro Stats */}
        <MacroSection title="Macro trung bình 7 ngày" macros={macroStats} />

        {/* Streak Card */}
        <StreakCard
          currentStreak={currentStreak}
          bestStreak={bestStreak}
          lastActive={lastActive}
        />

        {/* Additional Stats */}
        <section className="bg-white/88 backdrop-blur-md border border-[#005239]/10 shadow-lg rounded-[24px] p-6">
          <h3 className="text-[18px] font-bold text-[#005239] mb-6">
            Các chỉ số khác
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#caeadd]">
              <span className="text-[#6f7973] font-medium">Tổng calo tuần này</span>
              <span className="text-lg font-bold text-[#005239] font-['Space_Grotesk']">
                {Math.round(
                  weeklyData.reduce((sum, d) => sum + d.calories, 0)
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#caeadd]">
              <span className="text-[#6f7973] font-medium">Thứ tốt nhất</span>
              <span className="text-lg font-bold text-[#005239] font-['Space_Grotesk']">
                Thứ ba
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-[#6f7973] font-medium">BMI (Mock)</span>
              <span className="text-lg font-bold text-[#005239] font-['Space_Grotesk']">
                22.5
              </span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-[#005239] text-white py-3 rounded-[16px] font-medium hover:opacity-90 transition-opacity active:scale-[0.98]">
            <span className="material-symbols-outlined mr-2">download</span>
            Xuất báo cáo
          </button>
          <Link href="/diary" className="flex-1">
            <button className="w-full bg-white text-[#005239] py-3 rounded-[16px] font-medium border-2 border-[#005239] hover:bg-[#f4fbf6] transition-colors active:scale-[0.98]">
              <span className="material-symbols-outlined mr-2">edit</span>
              Nhập liệu
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
