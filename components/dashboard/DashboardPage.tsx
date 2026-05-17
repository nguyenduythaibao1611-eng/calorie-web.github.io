"use client";

import React, { useEffect, useState } from "react";
import { useDiaryStore } from "@/store/diaryStore";
import { useProfileStore } from "@/store/profileStore";
import Link from "next/link";
import { motion } from "framer-motion";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  dinner: "Bữa tối",
  snack: "Ăn vặt",
};

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack"];

const MEAL_SUBTITLES: Record<string, string> = {
  breakfast: "Ghi nhận bữa sáng của bạn",
  lunch: "Ghi nhận bữa trưa của bạn",
  dinner: "Ghi nhận bữa tối của bạn",
  snack: "Ghi nhận bữa phụ của bạn",
};

const MEAL_ICONS: Record<string, string> = {
  breakfast: "egg_alt",
  lunch: "lunch_dining",
  dinner: "dinner_dining",
  snack: "bakery_dining",
};

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
    },
  }),
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { currentLog, currentDate, loadLog, updateWater } = useDiaryStore();
  const { profile, syncStreak } = useProfileStore();

  useEffect(() => {
    // Use a microtask to avoid "synchronous setState in effect" error
    queueMicrotask(() => setMounted(true));
    loadLog(new Date().toISOString().slice(0, 10));
    // Đồng bộ streak từ logs khi mount trang
    syncStreak();
  }, [loadLog, syncStreak]);

  if (!mounted) return null;

  const TARGET = Math.max(profile?.macroTarget?.calories ?? 2480, 1);
  const consumed = Math.max(currentLog?.totalCalories || 0, 0);
  const remaining = Math.max(TARGET - consumed, 0);
  const CIRC = 930;
  const percentage = Math.min((consumed / TARGET) * 100, 100);
  const dashOffset = CIRC - (CIRC * percentage) / 100;

  const macros = currentLog?.meals.reduce(
    (acc, meal) => {
      meal.ingredients.forEach((ing) => {
        acc.p += Number(ing.protein) || 0;
        acc.c += Number(ing.carbs) || 0;
        acc.f += Number(ing.fat) || 0;
      });
      return acc;
    },
    { p: 0, c: 0, f: 0 },
  ) || { p: 0, c: 0, f: 0 };

  const macroTargets = {
    p: Math.max(profile?.macroTarget?.protein ?? 120, 1),
    c: Math.max(profile?.macroTarget?.carbs ?? 250, 1),
    f: Math.max(profile?.macroTarget?.fat ?? 65, 1),
  };

  const waterGlasses = Math.min(Math.max(currentLog?.water || 0, 0), 50);
  const waterMl = waterGlasses * 250;

  const handleWaterClick = (i: number) => {
    const newVal = i < waterGlasses ? i : i + 1;
    updateWater(Math.min(newVal, 50));
  };

  const dateObj = new Date(currentDate || new Date());
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const todayStr = new Date().toISOString().slice(0, 10);
  const isToday = currentDate === todayStr;
  const isAfterToday = (currentDate || "") > todayStr;

  const mealMap = Object.fromEntries(
    (currentLog?.meals || []).map((m) => [m.mealType, m]),
  );

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-900/10 h-14 flex justify-center items-center px-4 sm:px-6">
        <div className="w-full max-w-7xl flex justify-between items-center gap-2">
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
                Chuỗi{" "}
                <span className="font-numbers">
                  {profile?.currentStreak ?? 0}
                </span>{" "}
                ngày
              </span>
            </div>
            <Link href="/settings">
              <button className="hover:bg-surface-container transition-all active:scale-95 p-2 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">
                  settings
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-28 sm:pb-24 px-4 sm:px-6 max-w-[1100px] mx-auto">
        {/* Date Navigation */}
        <nav className="flex items-center justify-center gap-4 sm:gap-8 my-4 sm:my-5">
          <button
            onClick={() => loadLog(offsetDate(currentDate, -1))}
            className="p-2 hover:bg-surface-container rounded-full transition-colors group shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl text-outline group-hover:text-primary">
              chevron_left
            </span>
          </button>
          {/* text-lg mobile → text-2xl tablet → text-3xl desktop */}
          <h2 className="font-h1 text-lg sm:text-2xl lg:text-3xl text-primary font-bold text-center leading-tight">
            {isToday ? "Hôm nay" : "Ngày"},{" "}
            <span className="font-numbers">{day}</span> tháng{" "}
            <span className="font-numbers">{month}</span>
          </h2>
          <button
            onClick={() => loadLog(offsetDate(currentDate, 1))}
            disabled={isAfterToday}
            className="p-2 hover:bg-surface-container rounded-full transition-colors group disabled:opacity-30 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl text-outline group-hover:text-primary">
              chevron_right
            </span>
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* LEFT */}
          <motion.div
            className="lg:col-span-7 space-y-4 sm:space-y-5"
            initial="hidden"
            animate="visible"
          >
            {/* Calorie Ring */}
            <motion.section
              custom={0}
              variants={cardVariants}
              className="glass-card rounded-3xl p-4 sm:p-6 flex flex-col items-center"
            >
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center mb-4 sm:mb-5">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 320 320"
                >
                  <circle
                    cx="160" cy="160" r="148"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-surface-container-highest"
                  />
                  <circle
                    cx="160" cy="160" r="148"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={dashOffset}
                    className="text-primary transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-stat-display text-4xl sm:text-5xl text-primary font-numbers">
                    {remaining.toLocaleString()}
                  </span>
                  <span className="font-label-caps text-[10px] sm:text-xs text-outline uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 font-bold">
                    kcal còn lại
                  </span>
                </div>
              </div>

              <div className="w-full sm:max-w-sm grid grid-cols-3 gap-3 sm:gap-6">
                {[
                  { label: "Carbs", current: macros.c, target: macroTargets.c },
                  { label: "Protein", current: macros.p, target: macroTargets.p },
                  { label: "Fat", current: macros.f, target: macroTargets.f },
                ].map((m) => (
                  <div key={m.label} className="space-y-1.5 sm:space-y-2 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-0.5">
                      <span className="font-label-caps text-[9px] sm:text-[10px] font-bold text-primary uppercase truncate">
                        {m.label}
                      </span>
                      <span className="font-stat-value text-[10px] sm:text-xs font-numbers text-on-surface-variant">
                        {Math.round(m.current)}/{m.target}g
                      </span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min((m.current / m.target) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Water */}
            <motion.section
              custom={1}
              variants={cardVariants}
              className="glass-card rounded-3xl p-4 sm:p-5"
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div>
                  <h3 className="font-h2 text-base sm:text-lg text-primary font-bold">
                    Uống nước
                  </h3>
                  <p className="text-xs text-outline">
                    Mục tiêu: <span className="font-numbers">2,000</span> ml
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-stat-display text-2xl sm:text-3xl text-primary leading-none font-numbers">
                    {waterMl.toLocaleString()}
                  </span>
                  <span className="font-label-caps text-xs sm:text-sm text-primary/60 ml-1 uppercase font-bold">
                    ml
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-0 sm:justify-between items-center px-0 sm:px-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleWaterClick(i)}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span
                      className={`material-symbols-outlined text-3xl sm:text-4xl ${
                        i < waterGlasses
                          ? "filled-icon text-primary"
                          : "text-outline/20"
                      }`}
                    >
                      water_full
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          </motion.div>

          {/* RIGHT: Meal Log */}
          <motion.div
            className="lg:col-span-5 space-y-3"
            initial="hidden"
            animate="visible"
          >
            <motion.div
              custom={0}
              variants={cardVariants}
              className="flex justify-between items-center px-1 mb-1"
            >
              <h3 className="font-h2 text-base sm:text-lg text-primary font-bold">
                Bữa ăn hôm nay
              </h3>
              <Link
                href="/diary"
                className="text-primary hover:underline font-label-caps text-xs font-bold uppercase tracking-widest"
              >
                Xem tất cả
              </Link>
            </motion.div>

            <div className="space-y-3">
              {MEAL_ORDER.map((mealType, index) => {
                const meal = mealMap[mealType];
                const label = MEAL_LABELS[mealType];
                return (
                  <motion.div
                    key={mealType}
                    custom={index + 1}
                    variants={cardVariants}
                  >
                    {meal ? (
                      <Link href="/diary">
                        <div className="glass-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 hover:bg-white transition-all cursor-pointer group hover:shadow-md">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0 bg-surface-container group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                            <span className="material-symbols-outlined filled-icon text-primary text-xl sm:text-2xl">
                              {MEAL_ICONS[mealType]}
                            </span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <div className="min-w-0">
                                <h4 className="font-body-md font-bold text-primary text-sm sm:text-base">
                                  {label}
                                </h4>
                                <p className="text-xs text-outline truncate">
                                  {meal.ingredients.map((i) => i.name).slice(0, 2).join(", ") ||
                                    `${meal.ingredients.length} món`}
                                </p>
                              </div>
                              <span className="font-stat-value text-sm sm:text-base text-primary font-numbers whitespace-nowrap shrink-0">
                                {meal.totalCalories} kcal
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link href="/diary">
                        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 border-2 border-dashed border-outline-variant opacity-60 hover:opacity-100 transition-all cursor-pointer group">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                            <span className="material-symbols-outlined text-outline-variant text-xl sm:text-2xl">
                              add
                            </span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <div className="min-w-0">
                                <h4 className="font-body-md font-bold text-primary/60 text-sm sm:text-base">
                                  {label}
                                </h4>
                                <p className="text-xs text-outline/60 truncate">
                                  {MEAL_SUBTITLES[mealType]}
                                </p>
                              </div>
                              <span className="font-stat-value text-sm sm:text-base text-primary/60 font-numbers shrink-0">
                                0 kcal
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>

      {/* FAB */}
      <Link
        href="/diary"
        className="fixed bottom-20 right-4 sm:right-8 z-40"
      >
        <motion.div
          className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">
            add
          </span>
        </motion.div>
      </Link>

      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-primary/10 h-16 flex justify-center items-center">
        <nav className="w-full max-w-7xl flex justify-around items-center px-2 sm:px-8">
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 px-4 sm:px-8 rounded-2xl bg-secondary-container text-primary transition-all"
          >
            <span className="material-symbols-outlined filled-icon text-xl sm:text-2xl">
              home
            </span>
            <span className="font-label-caps text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em]">
              Tổng quan
            </span>
          </Link>
          <Link
            href="/diary"
            className="flex flex-col items-center gap-0.5 sm:gap-1 text-outline hover:text-primary transition-colors py-2 px-4 sm:px-8"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">
              menu_book
            </span>
            <span className="font-label-caps text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em]">
              Nhật ký
            </span>
          </Link>
          <Link
            href="/stats"
            className="flex flex-col items-center gap-0.5 sm:gap-1 text-outline hover:text-primary transition-colors py-2 px-4 sm:px-8"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl">
              bar_chart
            </span>
            <span className="font-label-caps text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em]">
              Thống kê
            </span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}