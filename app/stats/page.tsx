"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";
import { getLogs } from "@/lib/storage";
import type { DailyLog } from "@/types";

import { BottomNav } from "@/components/nav/BottomNav";
import Link from "next/link";

const WeeklyChart = dynamic(() => import("@/components/stats/WeeklyChart"), {
  loading: () => (
    <div className="rounded-3xl bg-white/60 border border-primary/10 h-[280px] animate-pulse" />
  ),
  ssr: false,
});

const StatCard = dynamic(() => import("@/components/stats/StatCard"), {
  loading: () => (
    <div className="rounded-3xl bg-white/60 border border-primary/10 h-24 animate-pulse" />
  ),
  ssr: false,
});

const MacroSection = dynamic(() => import("@/components/stats/MacroSection"), {
  loading: () => (
    <div className="rounded-3xl bg-white/60 border border-primary/10 h-64 animate-pulse" />
  ),
  ssr: false,
});

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function getWeekRange(): string {
  const days = getLast7Days();
  const start = new Date(days[0]);
  const end = new Date(days[6]);
  const fmt = (d: Date) =>
    d.toLocaleDateString("vi-VN", { day: "numeric", month: "long" });
  return `${fmt(start)} - ${fmt(end)}, ${end.getFullYear()}`;
}

function getDayLabel(dateStr: string): string {
  const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return labels[new Date(dateStr).getDay()];
}

function calcAvgMacros(logs: DailyLog[]) {
  if (logs.length === 0) return { protein: 0, carbs: 0, fat: 0 };
  const total = logs.reduce(
    (acc, log) => {
      log.meals.forEach((m) =>
        m.ingredients.forEach((i) => {
          const r = (i.amount ?? 100) / 100;
          acc.protein += i.protein * r;
          acc.carbs += i.carbs * r;
          acc.fat += i.fat * r;
        }),
      );
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 },
  );
  const count = logs.filter((l) => l.totalCalories > 0).length || 1;
  return {
    protein: Math.round(total.protein / count),
    carbs: Math.round(total.carbs / count),
    fat: Math.round(total.fat / count),
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.45,
    },
  }),
};

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const { profile, loadProfile, syncStreak } = useProfileStore();

  useEffect(() => {
    loadProfile();
    const days = getLast7Days();
    // Use microtasks to avoid "synchronous setState in effect" error
    queueMicrotask(() => {
      setLogs(getLogs(days[0], days[days.length - 1]));
      setMounted(true);
    });
    // Đồng bộ streak từ logs (dùng chung logic với các trang khác)
    syncStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const target = profile?.macroTarget?.calories ?? 2000;
  const today = new Date().toISOString().split("T")[0];
  const days = useMemo(() => getLast7Days(), []);

  const daysLogged = useMemo(
    () => logs.filter((l) => l.totalCalories > 0).length,
    [logs],
  );
  const avgCalories = useMemo(
    () =>
      daysLogged > 0
        ? Math.round(logs.reduce((s, l) => s + l.totalCalories, 0) / daysLogged)
        : 0,
    [logs, daysLogged],
  );
  const daysMetTarget = useMemo(
    () => logs.filter((l) => l.totalCalories >= target * 0.8).length,
    [logs, target],
  );
  const totalDeficit = useMemo(
    () =>
      logs
        .filter((l) => l.totalCalories > 0)
        .reduce((s, l) => s + (l.totalCalories - target), 0),
    [logs, target],
  );
  const currentStreak = profile?.currentStreak ?? 0;
  const avgMacros = useMemo(() => calcAvgMacros(logs), [logs]);

  const macroKcal = useMemo(() => {
    const protein = avgMacros.protein * 4;
    const carbs = avgMacros.carbs * 4;
    const fat = avgMacros.fat * 9;
    const total = protein + carbs + fat || 1;
    return { protein, carbs, fat, total };
  }, [avgMacros]);

  const macroStats = useMemo(
    () => [
      {
        label: "TINH BỘT",
        percent: Math.round((macroKcal.carbs / macroKcal.total) * 100),
        kcal: macroKcal.carbs,
        color: "primary" as const,
      },
      {
        label: "ĐẠM",
        percent: Math.round((macroKcal.protein / macroKcal.total) * 100),
        kcal: macroKcal.protein,
        color: "primary-container" as const,
      },
      {
        label: "CHẤT BÉO",
        percent: Math.round((macroKcal.fat / macroKcal.total) * 100),
        kcal: macroKcal.fat,
        color: "outline-variant" as const,
      },
    ],
    [macroKcal],
  );

  const weeklyData = useMemo(
    () =>
      days.map((date) => {
        const log = logs.find((l) => l.date === date);
        return {
          date: getDayLabel(date),
          calories: log?.totalCalories ?? 0,
          target,
          isToday: date === today,
        };
      }),
    [days, logs, target, today],
  );

  const weekRange = useMemo(() => getWeekRange(), []);

  if (!mounted) return null;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-900/10 h-14 flex justify-center items-center px-4 sm:px-6">
        <div className="w-full max-w-[1100px] flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined filled-icon text-primary text-2xl">
              local_fire_department
            </span>
            <h1 className="font-h1 text-xl sm:text-2xl text-primary font-black tracking-tight">
              CaloMate
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-primary-fixed-dim/30 px-4 py-1.5 rounded-full">
              <span className="material-symbols-outlined filled-icon text-primary text-base">
                local_fire_department
              </span>
              <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-primary">
                Chuỗi <span className="font-numbers">{currentStreak}</span> ngày
              </span>
            </div>
            <Link href="/settings">
              <button className="hover:bg-surface-container transition-all active:scale-95 p-2 rounded-full">
                <span className="material-symbols-outlined text-primary text-xl">
                  settings
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="pt-16 pb-24 px-4 sm:px-6 max-w-[1100px] mx-auto space-y-5">
        {/* Title */}
        <motion.section
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1 text-center pt-4"
        >
          <h2 className="font-h1 text-xl sm:text-2xl text-primary font-bold">
            Thống kê tuần này
          </h2>
          <p className="font-body-md text-sm sm:text-base text-secondary font-semibold">
            {weekRange}
          </p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* Left */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Chart */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <WeeklyChart data={weeklyData} />
            </motion.div>

            {/* Stat cards */}
            <section className="grid grid-cols-2 gap-4 sm:gap-5">
              {[
                { label: "TB MỖI NGÀY", value: avgCalories.toLocaleString(), unit: "kcal" },
                { label: "ĐẠT MỤC TIÊU", value: `${daysMetTarget}/7`, unit: "ngày" },
                {
                  label: "THÂM HỤT",
                  value: totalDeficit >= 0 ? `+${totalDeficit.toLocaleString()}` : totalDeficit.toLocaleString(),
                  unit: "kcal",
                  isNegative: totalDeficit < 0,
                },
                { label: "CHUỖI STREAK", value: currentStreak, unit: "ngày", isStreak: true },
              ].map((card, index) => (
                <motion.div
                  key={card.label}
                  custom={index + 2}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <StatCard {...card} />
                </motion.div>
              ))}
            </section>
          </div>

          {/* Right */}
          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 h-full"
          >
            <MacroSection macros={macroStats} />
          </motion.div>
        </div>

        {/* Empty state */}
        {logs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-10 glass-card rounded-3xl"
          >
            <span className="material-symbols-outlined text-4xl text-outline">
              bar_chart
            </span>
            <p className="text-outline text-sm mt-2">
              Chưa có dữ liệu tuần này
            </p>
            <p className="text-outline/60 text-xs mt-1">
              Hãy ghi nhật ký bữa ăn đầu tiên!
            </p>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}