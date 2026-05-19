"use client";

import React, { useEffect, useState } from "react";
import { useDiaryStore } from "@/store/diaryStore";
import { useProfileStore } from "@/store/profileStore";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { AppShell } from "@/components/nav/AppShell";
import AddMealModalV2 from "@/components/diary/AddMealModalV2";
import { getLog } from "@/lib/storage";
import { calcMinWater } from "@/lib/calc-water";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTodayStr(): string {
  return new Date().toLocaleDateString("en-CA");
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return getTodayStr();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
}

function get7Days(anchorDate: string): string[] {
  return Array.from({ length: 7 }, (_, i) => offsetDate(anchorDate, i - 6));
}

function dateCalories(dateStr: string): number {
  const log = getLog(dateStr);
  return log?.totalCalories ?? 0;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

const ingredientVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.15 } },
};

const accordionVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.25 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------------------------
// Sub-component: 7-day calendar strip
// ---------------------------------------------------------------------------

interface WeekCalendarProps {
  currentDate: string;
  todayStr: string;
  stripAnchor: string;
  onSelectDate: (date: string) => void;
}

function WeekCalendar({ currentDate, todayStr, stripAnchor, onSelectDate }: WeekCalendarProps) {
  const days = get7Days(stripAnchor).filter((d) => d <= todayStr);

  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 px-1">
      {days.map((dateStr) => {
        const d = new Date(dateStr);
        const dayLabel = DAY_LABELS[d.getDay()];
        const dayNum = d.getDate();
        const monthNum = d.getMonth() + 1;
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === currentDate;
        const kcal = dateCalories(dateStr);
        const hasData = kcal > 0;

        return (
          <motion.button
            key={dateStr}
            onClick={() => onSelectDate(dateStr)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.02 }}
            className={`
              flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all outline-none
              ${isSelected
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : isToday
                ? "bg-primary/10 text-primary font-bold"
                : "hover:bg-surface-container text-on-surface-variant"
              }
            `}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-white/60" : "text-outline"}`}>
              {dayLabel}
            </span>

            <span className="inline-flex items-end gap-[1px] mt-0.5 leading-none">
              <span className={`font-numbers font-bold text-base sm:text-lg leading-none ${isSelected ? "text-white" : "text-on-background"}`}>
                {dayNum}
              </span>
              <span className={`font-numbers text-[9px] font-medium mb-[1px] ${isSelected ? "text-white/50" : "text-outline/50"}`}>
                /{monthNum}
              </span>
            </span>

            <span className={`font-numbers text-[9px] mt-1 leading-tight font-semibold ${
              isSelected
                ? "text-white/80"
                : hasData
                ? "text-primary"
                : "text-outline/50"
            }`}>
              {hasData
                ? kcal >= 1000
                  ? `${(kcal / 1000).toFixed(1)}k kcal`
                  : `${kcal} kcal`
                : "0 kcal"}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [modalMealType, setModalMealType] = useState<string | null>(null);
  const [stripAnchor, setStripAnchor] = useState<string>(getTodayStr());
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: true,
  });

  // Zustand selectors tách riêng — tránh re-render thừa
  const currentLog = useDiaryStore((state) => state.currentLog);
  const currentDate = useDiaryStore((state) => state.currentDate);
  const loadLog = useDiaryStore((state) => state.loadLog);
  const updateWater = useDiaryStore((state) => state.updateWater);
  const removeIngredient = useDiaryStore((state) => state.removeIngredient);
  const replaceMealIngredients = useDiaryStore((state) => state.replaceMealIngredients);

  const { profile, syncStreak, loadProfile } = useProfileStore();

  useEffect(() => {
    setMounted(true);
    loadProfile();
    const today = getTodayStr();
    loadLog(today);
    syncStreak();
  }, [loadProfile, loadLog, syncStreak]);

  if (!mounted) return null;

  const handleSelectDate = (dateStr: string) => {
    loadLog(dateStr);
  };

  // ── Vòng tròn Calo ────────────────────────────────────────────────────────
  const TARGET = Math.max(profile?.macroTarget?.calories ?? 2480, 1);
  const consumed = Math.max(currentLog?.totalCalories || 0, 0);
  const CIRC = 930;
  const percentage = Math.min((consumed / TARGET) * 100, 100);
  const dashOffset = CIRC - (CIRC * percentage) / 100;

  // ── Macros ────────────────────────────────────────────────────────────────
  const macros = currentLog?.meals?.reduce(
    (acc, meal) => {
      meal.ingredients?.forEach((ing) => {
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

  // ── Water ─────────────────────────────────────────────────────────────────
  const ACTIVITY_LEVEL_MAP = ["sedentary", "light", "moderate", "active", "veryActive"] as const;
  const waterActivityLevel =
    typeof profile?.activityLevel === "number"
      ? (ACTIVITY_LEVEL_MAP[profile.activityLevel] ?? "moderate")
      : "moderate";
  const waterGender = profile?.gender ?? "male";
  const waterGoal = profile
    ? calcMinWater(profile, waterActivityLevel, waterGender)
    : 2500;
  const mlPerGlass = Math.round(waterGoal / 10);

  const waterGlassCount = Math.min(Math.max(currentLog?.water || 0, 0), 50);
  const waterMl = waterGlassCount * mlPerGlass;

  const handleWaterClick = (i: number) => {
    const newVal = i < waterGlassCount ? i : i + 1;
    updateWater(Math.min(newVal, 50));
  };

  // ── Calendar nav ──────────────────────────────────────────────────────────
  const todayStr = getTodayStr();
  const daysInCurrentStrip = get7Days(stripAnchor);
  const canGoForward = !daysInCurrentStrip.includes(todayStr) && stripAnchor < todayStr;

  const mealMap = Object.fromEntries(
    (currentLog?.meals || []).map((m) => [m.mealType, m]),
  );

  const dateObj = new Date(currentDate || todayStr);
  const isToday = currentDate === todayStr;
  const mealSectionLabel = isToday
    ? "Bữa ăn hôm nay"
    : `Bữa ăn ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

  const toggleMeal = (mealType: string) => {
    setExpandedMeals((prev) => ({ ...prev, [mealType]: !prev[mealType] }));
  };

  return (
    <AppShell>
      <div className="bg-background text-on-background font-body-md min-h-screen">
        <main className="pt-16 pb-32 sm:pb-28 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto">

          {/* Thanh lịch 7 ngày */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl p-3 sm:p-4 my-4 sm:my-5 lg:my-6"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStripAnchor(offsetDate(stripAnchor, -7))}
                className="p-1.5 hover:bg-surface-container rounded-full transition-colors group shrink-0"
                aria-label="Tuần trước"
              >
                <span className="material-symbols-outlined text-lg text-outline group-hover:text-primary">
                  chevron_left
                </span>
              </button>

              <div className="flex-1">
                <WeekCalendar
                  currentDate={currentDate || todayStr}
                  todayStr={todayStr}
                  stripAnchor={stripAnchor}
                  onSelectDate={handleSelectDate}
                />
              </div>

              <button
                onClick={() => {
                  const nextAnchor = offsetDate(stripAnchor, 7);
                  setStripAnchor(nextAnchor > todayStr ? todayStr : nextAnchor);
                }}
                disabled={!canGoForward}
                className="p-1.5 hover:bg-surface-container rounded-full transition-colors group shrink-0 disabled:opacity-30"
                aria-label="Tuần sau"
              >
                <span className="material-symbols-outlined text-lg text-outline group-hover:text-primary">
                  chevron_right
                </span>
              </button>
            </div>
          </motion.div>

          {/* Bố cục chính */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start">

            {/* CỘT TRÁI: Danh sách bữa ăn */}
            <motion.div className="lg:col-span-5 space-y-3" initial="hidden" animate="visible">
              <motion.div custom={0} variants={cardVariants} className="flex items-center px-1 mb-1">
                <h3 className="font-h2 text-base sm:text-lg text-primary font-bold">
                  {mealSectionLabel}
                </h3>
              </motion.div>

              <div className="space-y-3">
                {MEAL_ORDER.map((mealType, index) => {
                  const meal = mealMap[mealType];
                  const label = MEAL_LABELS[mealType];
                  const hasMeals = meal && meal.ingredients && meal.ingredients.length > 0;
                  const isExpanded = expandedMeals[mealType] ?? true;

                  return (
                    <motion.div key={mealType} custom={index + 1} variants={cardVariants}>
                      {hasMeals ? (
                        <div className="glass-card rounded-2xl overflow-hidden">
                          <div
                            className="flex items-center gap-3 p-3 sm:p-4 cursor-pointer select-none"
                            onClick={() => toggleMeal(mealType)}
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0 bg-surface-container flex items-center justify-center">
                              <span className="material-symbols-outlined filled-icon text-primary text-lg sm:text-xl">
                                {MEAL_ICONS[mealType]}
                              </span>
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-body-md font-bold text-primary text-sm sm:text-base leading-tight">
                                {label}
                              </h4>
                              <p className="text-xs text-outline font-numbers">
                                {meal.totalCalories} kcal · {meal.ingredients.length} món
                              </p>
                            </div>

                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="material-symbols-outlined text-outline text-xl flex-shrink-0"
                            >
                              expand_more
                            </motion.span>

                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalMealType(mealType);
                              }}
                              whileTap={{ scale: 0.88 }}
                              whileHover={{ scale: 1.08 }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md"
                              aria-label={`Thêm món vào ${label}`}
                            >
                              <span className="material-symbols-outlined text-white text-base sm:text-lg">
                                add
                              </span>
                            </motion.button>
                          </div>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                key="ingredients"
                                variants={accordionVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{ overflow: "hidden" }}
                              >
                                <div className="mx-3 sm:mx-4 h-px bg-outline-variant/30" />
                                <ul className="px-3 sm:px-4 py-2 space-y-0.5">
                                  <AnimatePresence initial={false}>
                                    {meal.ingredients.map((ing) => {
                                      const ingId = ing.id ?? ing.name;
                                      const kcal = Math.round(Number(ing.calories) || 0);
                                      return (
                                        <motion.li
                                          key={ingId}
                                          variants={ingredientVariants}
                                          initial="hidden"
                                          animate="visible"
                                          exit="exit"
                                          className="flex items-center gap-2 py-1.5 group/item"
                                        >
                                          <div className="flex-grow min-w-0">
                                            <span className="text-xs sm:text-sm font-medium text-on-surface truncate block">
                                              {ing.name}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-outline font-numbers">
                                              {ing.amount ?? ""}g · {kcal} kcal
                                            </span>
                                          </div>
                                          <motion.button
                                            onClick={() => removeIngredient(meal.id, ingId)}
                                            whileTap={{ scale: 0.8 }}
                                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity bg-error/10 hover:bg-error/20"
                                            aria-label={`Xóa ${ing.name}`}
                                          >
                                            <span className="material-symbols-outlined text-error text-sm leading-none">
                                              close
                                            </span>
                                          </motion.button>
                                        </motion.li>
                                      );
                                    })}
                                  </AnimatePresence>
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <button
                          onClick={() => setModalMealType(mealType)}
                          className="w-full rounded-2xl p-3 sm:p-4 flex items-center gap-3 border-2 border-dashed border-outline-variant opacity-60 hover:opacity-100 transition-all cursor-pointer group text-left"
                        >
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
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* CỘT PHẢI: Vòng tròn Calo & Nước */}
            <motion.div className="lg:col-span-7 space-y-4 sm:space-y-5" initial="hidden" animate="visible">

              {/* Thống kê tiến độ Calo */}
              <motion.section custom={0} variants={cardVariants} className="glass-card rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col items-center">
                <div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-60 lg:h-60 flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                    <circle
                      cx="160" cy="160" r="148"
                      fill="transparent" stroke="currentColor" strokeWidth="16"
                      className="text-surface-container-highest"
                    />
                    <circle
                      cx="160" cy="160" r="148"
                      fill="transparent" stroke="currentColor" strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={dashOffset}
                      className={`transition-all duration-700 ease-out ${
                        percentage >= 100 ? "text-error" : "text-primary"
                      }`}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-stat-display text-3xl sm:text-4xl lg:text-5xl text-primary font-numbers">
                      {consumed.toLocaleString()}
                    </span>
                    <span className="font-label-caps text-[10px] sm:text-xs text-outline uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 font-bold">
                      kcal đã nạp
                    </span>
                    <span className="font-numbers text-[10px] sm:text-xs text-outline/70 mt-0.5">
                      <span className="text-primary font-bold text-sm sm:text-base">
                        {Math.round((consumed / TARGET) * 100)}%
                      </span>
                      {" / "}{TARGET.toLocaleString()} kcal
                    </span>
                  </div>
                </div>

                {/* Thanh macros */}
                <div className="w-full sm:max-w-sm lg:max-w-md flex flex-col gap-2.5 items-center">
                  {[
                    { label: "Carbs", current: macros.c, target: macroTargets.c },
                    { label: "Protein", current: macros.p, target: macroTargets.p },
                    { label: "Fat", current: macros.f, target: macroTargets.f },
                  ].map((m) => {
                    const pct = Math.min(Math.round((m.current / m.target) * 100), 100);
                    return (
                      <div key={m.label} className="flex items-center gap-3 w-4/5">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wide w-12 shrink-0">
                          {m.label}
                        </span>
                        <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-baseline gap-1 whitespace-nowrap w-20 justify-end shrink-0">
                          <span className="text-sm font-bold text-primary leading-none">
                            {Math.round((m.current / m.target) * 100)}%
                          </span>
                          <span className="text-[10px] text-outline/60 font-numbers">/ {m.target}g</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>

              {/* Lượng nước uống */}
              <motion.section custom={1} variants={cardVariants} className="glass-card rounded-3xl p-4 sm:p-5">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div>
                    <h3 className="font-h2 text-base sm:text-lg text-primary font-bold">
                      Mục tiêu uống nước
                    </h3>
                    <p className="text-xs text-outline">
                      <span className="font-numbers">{waterGoal.toLocaleString()}</span> ml
                      {" · "}
                      <span className="font-numbers">10</span> ly
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-stat-display text-2xl sm:text-3xl text-primary leading-none font-numbers">
                      {waterMl.toLocaleString()}
                    </span>
                    <span className="font-label-caps text-xs sm:text-sm text-primary/60 ml-1 uppercase font-bold">
                      ml
                    </span>
                    <p className="text-[10px] text-outline/60 font-numbers">
                      {waterGlassCount}/10 ly
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-y-2 sm:grid-cols-10 sm:gap-y-0 items-center px-0 sm:px-1 place-items-center">
                  {Array.from({ length: 10 }, (_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleWaterClick(i)}
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      aria-label={`Ly nước ${i + 1}`}
                    >
                      <span
                        className={`material-symbols-outlined text-[28px] xs:text-3xl sm:text-[32px] lg:text-4xl transition-all ${
                          i < waterGlassCount ? "text-primary" : "text-outline/20"
                        }`}
                        style={{
                          fontVariationSettings: i < waterGlassCount ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        water_full
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            </motion.div>

          </div>
        </main>

        {/* FAB */}
        <motion.button
          onClick={() => {
            const nextEmpty =
              MEAL_ORDER.find((t) => !mealMap[t] || !mealMap[t].ingredients || mealMap[t].ingredients.length === 0)
              ?? "breakfast";
            setModalMealType(nextEmpty);
          }}
          className="fixed bottom-20 right-4 sm:right-8 z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.4 }}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl sm:text-3xl">add</span>
          </div>
        </motion.button>

        {/* Modal thêm món ăn */}
        {modalMealType && (
          <AddMealModalV2
            mealType={modalMealType as "breakfast" | "lunch" | "dinner" | "snack"}
            existingIngredients={mealMap[modalMealType]?.ingredients || []}
            onClose={() => setModalMealType(null)}
            onSave={(ingredients) => {
              replaceMealIngredients(
                modalMealType as "breakfast" | "lunch" | "dinner" | "snack",
                ingredients,
              );
              setModalMealType(null);
            }}
          />
        )}
      </div>
    </AppShell>
  );
}