"use client";

import React, { useEffect, useState } from "react";
import { useDiaryStore } from "@/store/diaryStore";
import { useProfileStore } from "@/store/profileStore";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/nav/AppShell";
import AddMealModalV2 from "@/components/diary/AddMealModalV2";
import { getLog } from "@/lib/storage";

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
  return new Date().toISOString().slice(0, 10);
}

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return getTodayStr();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Returns array of 7 date strings: today is at index 3 (center) */
function get7Days(centerDate: string): string[] {
  return Array.from({ length: 7 }, (_, i) => offsetDate(centerDate, i - 3));
}

/** Check if a date has any logged food data */
function dateHasData(dateStr: string): boolean {
  const log = getLog(dateStr);
  return !!log && log.meals && log.meals.length > 0;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const ingredientVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.15 } },
};

const accordionVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
};

// ---------------------------------------------------------------------------
// Sub-component: 7-day calendar strip
// ---------------------------------------------------------------------------

interface WeekCalendarProps {
  currentDate: string;
  todayStr: string;
  onSelectDate: (date: string) => void;
}

function WeekCalendar({ currentDate, todayStr, onSelectDate }: WeekCalendarProps) {
  const days = get7Days(todayStr); // always centered on today

  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 px-1">
      {days.map((dateStr) => {
        const d = new Date(dateStr);
        const dayLabel = DAY_LABELS[d.getDay()];
        const dayNum = d.getDate();
        const isToday = dateStr === todayStr;
        const isSelected = dateStr === currentDate;
        const isFuture = dateStr > todayStr;
        const hasData = !isFuture && dateHasData(dateStr);

        return (
          <motion.button
            key={dateStr}
            onClick={() => !isFuture && onSelectDate(dateStr)}
            disabled={isFuture}
            whileTap={!isFuture ? { scale: 0.88 } : undefined}
            whileHover={!isFuture ? { scale: 1.08 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label={`Ngày ${dayNum}`}
            className={`
              flex-1 flex flex-col items-center py-2 rounded-xl transition-all
              ${isSelected
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : isToday
                ? "bg-primary/10 text-primary"
                : isFuture
                ? "opacity-25 cursor-not-allowed"
                : "hover:bg-surface-container text-on-surface-variant"
              }
            `}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? "text-white/70" : "text-outline"}`}>
              {dayLabel}
            </span>
            <span className={`font-numbers font-bold text-sm sm:text-base mt-0.5 ${isSelected ? "text-white" : "text-on-background"}`}>
              {dayNum}
            </span>
            {/* Dot indicator for days with data */}
            <span
              className={`
                mt-1 w-1.5 h-1.5 rounded-full transition-all
                ${hasData
                  ? isSelected ? "bg-white/70" : "bg-primary"
                  : "bg-transparent"
                }
              `}
            />
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

  // Modal state: which mealType is currently open (null = closed)
  const [modalMealType, setModalMealType] = useState<string | null>(null);

  // Accordion state — track which meal cards are expanded (default: all expanded)
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: true,
  });

  const { currentLog, currentDate, loadLog, updateWater, removeIngredient, addIngredients } =
    useDiaryStore();
  const { profile, syncStreak, loadProfile } = useProfileStore();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
    loadProfile();
    loadLog(getTodayStr());
    syncStreak();
  }, [loadLog, syncStreak, loadProfile]);

  if (!mounted) return null;

  // ── Kcal ring ─────────────────────────────────────────────────────────────
  const TARGET = Math.max(profile?.macroTarget?.calories ?? 2480, 1);
  const consumed = Math.max(currentLog?.totalCalories || 0, 0);
  const CIRC = 930;
  const percentage = Math.min((consumed / TARGET) * 100, 100);
  const dashOffset = CIRC - (CIRC * percentage) / 100;

  // ── Macros ────────────────────────────────────────────────────────────────
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

  // ── Water ─────────────────────────────────────────────────────────────────
  const waterGlasses = Math.min(Math.max(currentLog?.water || 0, 0), 50);
  const waterMl = waterGlasses * 250;

  const handleWaterClick = (i: number) => {
    const newVal = i < waterGlasses ? i : i + 1;
    updateWater(Math.min(newVal, 50));
  };

  // ── Date nav ──────────────────────────────────────────────────────────────
  const dateObj = new Date(currentDate || new Date());
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const todayStr = getTodayStr();
  const isToday = currentDate === todayStr;
  const isAfterToday = (currentDate || "") > todayStr;

  // ── Meal map ──────────────────────────────────────────────────────────────
  const mealMap = Object.fromEntries(
    (currentLog?.meals || []).map((m) => [m.mealType, m]),
  );

  // ── Toggle accordion ──────────────────────────────────────────────────────
  const toggleMeal = (mealType: string) => {
    setExpandedMeals((prev) => ({ ...prev, [mealType]: !prev[mealType] }));
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AppShell>
      <div className="bg-background text-on-background font-body-md min-h-screen">
        <main className="pt-16 pb-28 sm:pb-24 px-4 sm:px-6 max-w-[1100px] mx-auto">

          {/* ── 7-Day Calendar Strip ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl p-3 sm:p-4 my-4 sm:my-5"
          >
            <WeekCalendar
              currentDate={currentDate}
              todayStr={todayStr}
              onSelectDate={loadLog}
            />
          </motion.div>

          {/* ── Date Navigation ─────────────────────────────────────────── */}
          <nav className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-5">
            <button
              onClick={() => loadLog(offsetDate(currentDate, -1))}
              className="p-2 hover:bg-surface-container rounded-full transition-colors group shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl text-outline group-hover:text-primary">
                chevron_left
              </span>
            </button>

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

          {/* ── Main Grid ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">

            {/* ════════════════════════════════════════════════════════════
                LEFT: Bữa ăn hôm nay
            ════════════════════════════════════════════════════════════ */}
            <motion.div
              className="lg:col-span-5 space-y-3"
              initial="hidden"
              animate="visible"
            >
              {/* Section header */}
              <motion.div
                custom={0}
                variants={cardVariants}
                className="flex items-center px-1 mb-1"
              >
                <h3 className="font-h2 text-base sm:text-lg text-primary font-bold">
                  Bữa ăn hôm nay
                </h3>
              </motion.div>

              {/* Meal cards */}
              <div className="space-y-3">
                {MEAL_ORDER.map((mealType, index) => {
                  const meal = mealMap[mealType];
                  const label = MEAL_LABELS[mealType];
                  const hasMeals =
                    meal && meal.ingredients && meal.ingredients.length > 0;
                  const isExpanded = expandedMeals[mealType] ?? true;

                  return (
                    <motion.div
                      key={mealType}
                      custom={index + 1}
                      variants={cardVariants}
                    >
                      {hasMeals ? (
                        /* ── FILLED card ──────────────────────────────── */
                        <div className="glass-card rounded-2xl overflow-hidden">
                          {/* Card header — click to expand/collapse */}
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
                                {meal.totalCalories} kcal ·{" "}
                                {meal.ingredients.length} món
                              </p>
                            </div>

                            {/* Toggle chevron */}
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="material-symbols-outlined text-outline text-xl flex-shrink-0"
                            >
                              expand_more
                            </motion.span>

                            {/* Add more (+) button */}
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalMealType(mealType);
                              }}
                              whileTap={{ scale: 0.88 }}
                              whileHover={{ scale: 1.08 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 17,
                              }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md"
                              aria-label={`Thêm món vào ${label}`}
                            >
                              <span className="material-symbols-outlined text-white text-base sm:text-lg">
                                add
                              </span>
                            </motion.button>
                          </div>

                          {/* Accordion: ingredient list */}
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
                                {/* Divider */}
                                <div className="mx-3 sm:mx-4 h-px bg-outline-variant/30" />

                                {/* Ingredient list */}
                                <ul className="px-3 sm:px-4 py-2 space-y-0.5">
                                  <AnimatePresence initial={false}>
                                    {meal.ingredients.map((ing) => {
                                      // FIX: ensure we always have a stable key and a valid id for deletion
                                      const ingKey = ing.id ?? ing.name;
                                      const ingId = ing.id ?? ing.name; // fallback to name if id is missing
                                      const kcal = Math.round(
                                        Number(ing.calories) || 0,
                                      );
                                      return (
                                        <motion.li
                                          key={ingKey}
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
                                          {/* FIX: pass meal.id and ingId correctly */}
                                          <motion.button
                                            onClick={() => removeIngredient(meal.id, ingId)}
                                            whileTap={{ scale: 0.8 }}
                                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 opacity-40 hover:opacity-100 active:opacity-100 transition-opacity bg-error/10 hover:bg-error/20"
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
                        /* ── EMPTY card (dashed border) ───────────────── */
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

            {/* ════════════════════════════════════════════════════════════
                RIGHT: Vòng tròn Kcal + Uống nước
            ════════════════════════════════════════════════════════════ */}
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
                    {/* Track */}
                    <circle
                      cx="160"
                      cy="160"
                      r="148"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="16"
                      className="text-surface-container-highest"
                    />
                    {/* Fill */}
                    <circle
                      cx="160"
                      cy="160"
                      r="148"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={dashOffset}
                      className={`transition-all duration-700 ease-out ${
                        percentage >= 100 ? "text-error" : "text-primary"
                      }`}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-stat-display text-4xl sm:text-5xl text-primary font-numbers">
                      {consumed.toLocaleString()}
                    </span>
                    <span className="font-label-caps text-[10px] sm:text-xs text-outline uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 font-bold">
                      kcal đã nạp
                    </span>
                    <span className="font-numbers text-[10px] sm:text-xs text-outline/70 mt-0.5">
                      / {TARGET.toLocaleString()} kcal
                    </span>
                  </div>
                </div>

                {/* Macro bars */}
                <div className="w-full sm:max-w-sm grid grid-cols-3 gap-3 sm:gap-6">
                  {[
                    {
                      label: "Carbs",
                      current: macros.c,
                      target: macroTargets.c,
                    },
                    {
                      label: "Protein",
                      current: macros.p,
                      target: macroTargets.p,
                    },
                    {
                      label: "Fat",
                      current: macros.f,
                      target: macroTargets.f,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="space-y-1.5 sm:space-y-2 min-w-0"
                    >
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
                            width: `${Math.min(
                              (m.current / m.target) * 100,
                              100,
                            )}%`,
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
                      Mục tiêu:{" "}
                      <span className="font-numbers">2,000</span> ml
                      {" "}·{" "}
                      <span className="font-numbers">8</span> ly
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
                      {waterGlasses}/8 ly
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-0 sm:justify-between items-center px-0 sm:px-2">
                  {Array.from({ length: 8 }, (_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleWaterClick(i)}
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.15 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                      aria-label={`Ly nước ${i + 1}`}
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

          </div>
        </main>

        {/* ── FAB: thêm món vào bữa ăn đầu tiên còn trống ────────────── */}
        <motion.button
          onClick={() => {
            const nextEmpty =
              MEAL_ORDER.find(
                (t) => !mealMap[t] || mealMap[t].ingredients.length === 0,
              ) ?? "breakfast";
            setModalMealType(nextEmpty);
          }}
          className="fixed bottom-20 right-4 sm:right-8 z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.4,
          }}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl sm:text-3xl">
              add
            </span>
          </div>
        </motion.button>

        {/* ── Render Modal Thêm Món ─────────────────────────────────── */}
        {modalMealType && (
          <AddMealModalV2
            mealType={modalMealType as "breakfast" | "lunch" | "dinner" | "snack"}
            existingIngredients={mealMap[modalMealType]?.ingredients || []}
            onClose={() => setModalMealType(null)}
            onSave={(ingredients) => {
              addIngredients(
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