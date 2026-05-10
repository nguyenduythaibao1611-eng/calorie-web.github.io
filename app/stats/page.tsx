'use client';

import React, { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { getLogs } from '@/lib/storage';
import type { DailyLog } from '@/types';
import {
  WeeklyChart,
  StatCard,
  MacroSection,
  StreakCard,
} from '@/components/stats';
import Link from 'next/link';

// ============================================
// Helper functions
// ============================================

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })
}

function calcStreak(logs: DailyLog[], target: number) {
  const logMap = new Map(logs.map((l) => [l.date, l]))
  let currentStreak = 0
  let bestStreak = 0
  let tempStreak = 0
  let lastActive = 'Chưa có'

  // Current streak — đếm ngược từ hôm nay
  for (let i = 0; i <= 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const log = logMap.get(dateStr)
    if (log && log.totalCalories >= target * 0.8) {
      currentStreak++
      if (lastActive === 'Chưa có') lastActive = formatDateLabel(dateStr)
    } else {
      break
    }
  }

  // Best streak — toàn bộ lịch sử
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date))
  for (const log of sorted) {
    if (log.totalCalories >= target * 0.8) {
      tempStreak++
      bestStreak = Math.max(bestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }

  return { currentStreak, bestStreak, lastActive }
}

function calcAvgMacros(logs: DailyLog[]) {
  if (logs.length === 0) return { protein: 0, carbs: 0, fat: 0 }

  const total = logs.reduce(
    (acc, log) => {
      const protein = log.meals.reduce(
        (s, m) => s + m.ingredients.reduce(
          (si, i) => si + ((i.protein * (i.amount ?? 100)) / 100), 0
        ), 0
      )
      const carbs = log.meals.reduce(
        (s, m) => s + m.ingredients.reduce(
          (si, i) => si + ((i.carbs * (i.amount ?? 100)) / 100), 0
        ), 0
      )
      const fat = log.meals.reduce(
        (s, m) => s + m.ingredients.reduce(
          (si, i) => si + ((i.fat * (i.amount ?? 100)) / 100), 0
        ), 0
      )
      return {
        protein: acc.protein + protein,
        carbs: acc.carbs + carbs,
        fat: acc.fat + fat,
      }
    },
    { protein: 0, carbs: 0, fat: 0 }
  )

  const count = logs.filter((l) => l.totalCalories > 0).length || 1
  return {
    protein: Math.round(total.protein / count),
    carbs: Math.round(total.carbs / count),
    fat: Math.round(total.fat / count),
  }
}

// ============================================
// Main Component
// ============================================

export default function StatsPage() {
  const [mounted, setMounted] = useState(false)
  const [logs, setLogs] = useState<DailyLog[]>([])
  const { profile, loadProfile } = useProfileStore()

  useEffect(() => {
    loadProfile()
    const days = getLast7Days()
    const data = getLogs(days[0], days[days.length - 1])
    setLogs(data)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const target = profile?.macroTarget?.calories ?? 2000
  const days = getLast7Days()
  const daysLogged = logs.filter((l) => l.totalCalories > 0).length
  const avgCalories = daysLogged > 0
    ? Math.round(logs.reduce((s, l) => s + l.totalCalories, 0) / daysLogged)
    : 0
  const totalCal = logs.reduce((s, l) => s + l.totalCalories, 0)
  const daysMetTarget = logs.filter((l) => l.totalCalories >= target * 0.8).length
  const avgMacros = calcAvgMacros(logs)
  const { currentStreak, bestStreak, lastActive } = calcStreak(logs, target)

  // Chart data
  const weeklyData = days.map((date) => {
    const log = logs.find((l) => l.date === date)
    return {
      date: formatDateLabel(date),
      calories: log?.totalCalories ?? 0,
      target,
    }
  })

  // Macro section data
  const macroStats = [
    {
      label: 'Protein',
      current: avgMacros.protein,
      target: profile?.macroTarget?.protein ?? 120,
      icon: 'egg',
      color: '#ff6b35',
    },
    {
      label: 'Carbs',
      current: avgMacros.carbs,
      target: profile?.macroTarget?.carbs ?? 310,
      icon: 'breakfast_dining',
      color: '#0066cc',
    },
    {
      label: 'Fat',
      current: avgMacros.fat,
      target: profile?.macroTarget?.fat ?? 65,
      icon: 'oil',
      color: '#ff006e',
    },
  ]

  return (
    <div className="bg-[#f4fbf6] text-[#161d1a] font-['Be_Vietnam_Pro'] min-h-screen">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
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
            value={daysLogged}
            subtext="ngày trong tuần"
            color="blue"
          />
        </section>

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />

        {/* Macro trung bình */}
        <MacroSection title="Macro trung bình 7 ngày" macros={macroStats} />

        {/* Streak */}
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
                {totalCal.toLocaleString()} kcal
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#caeadd]">
              <span className="text-[#6f7973] font-medium">Ngày đạt mục tiêu</span>
              <span className="text-lg font-bold text-[#005239] font-['Space_Grotesk']">
                {daysMetTarget}/7 ngày
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[#6f7973] font-medium">Mục tiêu calo/ngày</span>
              <span className="text-lg font-bold text-[#005239] font-['Space_Grotesk']">
                {target.toLocaleString()} kcal
              </span>
            </div>
          </div>
        </section>

        {/* Empty state */}
        {logs.length === 0 && (
          <div className="text-center py-10 bg-white/88 rounded-[24px] border border-[#005239]/10">
            <span className="material-symbols-outlined text-4xl text-[#9db5ab]">
              bar_chart
            </span>
            <p className="text-[#6f7973] text-sm mt-2">Chưa có dữ liệu tuần này</p>
            <p className="text-[#9db5ab] text-xs mt-1">
              Hãy ghi nhật ký bữa ăn đầu tiên!
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          <Link href="/diary" className="flex-1">
            <button className="w-full bg-[#005239] text-white py-3 rounded-[16px] font-medium hover:opacity-90 transition-opacity active:scale-[0.98]">
              Nhập liệu
            </button>
          </Link>
        </div>

      </main>
    </div>
  )
}