"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useDiaryStore } from "@/store/diaryStore";
import { useProfileStore } from "@/store/profileStore";
import type { MealEntry, Ingredient } from "@/types";
import { BottomNav } from "@/components/nav/BottomNav";

const AddMealModal = dynamic(() => import("@/components/diary/AddMealModal"), {
  loading: () => null,
  ssr: false,
});

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const MEAL_META: Record<MealType, { label: string; icon: string }> = {
  breakfast: { label: "Bữa sáng", icon: "wb_sunny" },
  lunch: { label: "Bữa trưa", icon: "restaurant" },
  dinner: { label: "Bữa tối", icon: "bedtime" },
  snack: { label: "Ăn vặt", icon: "cookie" },
};

const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getToday(): string {
  return toLocalDateStr(new Date());
}

function offsetDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  return toLocalDateStr(date);
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return {
    day: d,
    month: m,
    isToday: dateStr === getToday(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

const MealSection = memo(function MealSection({
  mealType,
  meal,
  onAdd,
  onRemoveIngredient,
}: {
  mealType: MealType;
  meal: MealEntry | undefined;
  onAdd: (type: MealType) => void;
  onRemoveIngredient: (mealId: string, ingredientId: string) => void;
}) {
  const { label, icon } = MEAL_META[mealType];
  const hasItems = meal && meal.ingredients.length > 0;

  return (
    <section className="bg-surface-container-lowest rounded-3xl border border-primary/10 overflow-hidden transition-all hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined filled-icon text-primary text-2xl">
              {icon}
            </span>
          </div>
          <div>
            <h3 className="font-h2 text-base font-bold text-on-background">
              {label}
            </h3>
            <p className="font-numbers text-xs text-outline mt-0.5">
              <span className="font-bold text-primary">
                {meal?.totalCalories ?? 0}
              </span>{" "}
              kcal
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => onAdd(mealType)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
            hasItems
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {hasItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-primary/6 px-4 pb-4 pt-2 space-y-2 overflow-hidden"
          >
            {meal.ingredients.map((ing) => (
              <div
                key={ing.id}
                className="flex items-center gap-3 py-2 border-b border-primary/4 last:border-0 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                  <span className="text-lg" role="img" aria-label="món ăn">
                    🥗
                  </span>
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-body-md font-semibold text-sm text-on-background truncate">
                    {ing.name}
                  </p>
                  <p className="font-numbers text-[11px] text-outline">
                    {ing.amount}g • P:{ing.protein} C:{ing.carbs} F:{ing.fat}
                  </p>
                </div>
                <span className="font-numbers font-bold text-sm text-on-background shrink-0 mr-1">
                  {ing.calories}
                  <span className="text-[10px] font-normal text-outline ml-1">
                    kcal
                  </span>
                </span>
                <button
                  onClick={() => onRemoveIngredient(meal.id, ing.id)}
                  className="w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                  aria-label={`Xóa ${ing.name}`}
                  title="Xóa"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
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

export default function DiaryPage() {
  const { currentLog, loadLog, addIngredients, removeIngredient } =
    useDiaryStore();
  const { profile, loadProfile, updateProfile } = useProfileStore();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(getToday);
  const [modalMeal, setModalMeal] = useState<MealType | null>(null);

  useEffect(() => {
    loadProfile();
    loadLog(getToday());
    setMounted(true);
  }, [loadProfile, loadLog]);

  useEffect(() => {
    if (mounted) loadLog(currentDate);
  }, [currentDate, mounted, loadLog]);

  const today = getToday();

  const goBack = useCallback(
    () => setCurrentDate((d) => offsetDate(d, -1)),
    [],
  );
  const goNext = useCallback(() => {
    setCurrentDate((d) => {
      const next = offsetDate(d, 1);
      return next > getToday() ? d : next;
    });
  }, []);

  const openModal = useCallback((type: MealType) => setModalMeal(type), []);
  const closeModal = useCallback(() => setModalMeal(null), []);

  const handleStreakUpdate = useCallback(
    (streak: { currentStreak: number; bestStreak: number }) => {
      if (profile) updateProfile(streak);
    },
    [profile, updateProfile],
  );

  const target = profile?.macroTarget?.calories ?? 2000;
  const consumed = currentLog?.totalCalories ?? 0;
  const remaining = target - consumed;

  function getMeal(type: MealType): MealEntry | undefined {
    return currentLog?.meals.find((m) => m.mealType === type);
  }

  const handleAddIngredient = useCallback(
    (mealType: MealType, ingredient: Ingredient) => {
      // Re-using addIngredients for single ingredient too
      addIngredients(mealType, [ingredient], handleStreakUpdate);
    },
    [addIngredients, handleStreakUpdate],
  );

  const handleRemoveIngredient = useCallback(
    (mealId: string, ingredientId: string) => {
      removeIngredient(mealId, ingredientId, handleStreakUpdate);
    },
    [removeIngredient, handleStreakUpdate],
  );

  if (!mounted) return null;

  const { day, month, isToday: todayFlag } = formatDate(currentDate);
  const isAfterToday = currentDate >= today;

  const macros = currentLog?.meals.reduce(
    (acc, meal) => {
      meal.ingredients.forEach((ing) => {
        acc.p += ing.protein || 0;
        acc.c += ing.carbs || 0;
        acc.f += ing.fat || 0;
      });
      return acc;
    },
    { p: 0, c: 0, f: 0 },
  ) || { p: 0, c: 0, f: 0 };

  const macroTargets = {
    p: profile?.macroTarget?.protein ?? 120,
    c: profile?.macroTarget?.carbs ?? 250,
    f: profile?.macroTarget?.fat ?? 65,
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
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
                Chuỗi{" "}
                <span className="font-numbers">
                  {profile?.currentStreak ?? 0}
                </span>{" "}
                ngày
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

      <main className="pt-16 pb-28 sm:pb-24 px-4 sm:px-6 max-w-[1100px] mx-auto">
        <nav className="flex items-center justify-center gap-4 sm:gap-8 my-4 sm:my-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goBack}
            className="p-2 hover:bg-surface-container rounded-full transition-colors group shrink-0"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl text-outline group-hover:text-primary">
              chevron_left
            </span>
          </motion.button>

          <h2 className="font-h1 text-xl sm:text-3xl text-primary font-bold text-center leading-tight">
            {todayFlag ? "Hôm nay" : "Ngày"},{" "}
            <span className="font-numbers">{day}</span> Tháng{" "}
            <span className="font-numbers">{month}</span>
          </h2>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            disabled={isAfterToday}
            className="p-2 hover:bg-surface-container rounded-full transition-colors group disabled:opacity-30 shrink-0"
          >
            <span className="material-symbols-outlined text-xl sm:text-2xl text-outline group-hover:text-primary">
              chevron_right
            </span>
          </motion.button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <motion.section
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="glass-card rounded-3xl p-4 sm:p-6"
            >
              <p className="font-label-caps text-[10px] uppercase tracking-widest text-outline mb-3">
                Tổng kết hôm nay
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-numbers text-5xl sm:text-6xl font-black text-primary tracking-tighter">
                  {remaining.toLocaleString()}
                </span>
                <span className="font-body-md text-sm font-semibold text-outline uppercase tracking-wider">
                  kcal còn lại
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Đã nạp",
                    value: consumed,
                    pct: Math.min((consumed / (target || 1)) * 100, 100),
                    opaque: false,
                  },
                  { label: "Mục tiêu", value: target, pct: 100, opaque: true },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">
                        {row.label}
                      </span>
                      <span className="font-numbers font-semibold text-sm text-primary">
                        {row.value.toLocaleString()}
                        <span className="text-[10px] font-normal text-outline ml-1">
                          kcal
                        </span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary"
                        style={{ opacity: row.opaque ? 0.25 : 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="glass-card rounded-3xl p-4 sm:p-6"
            >
              <p className="font-label-caps text-[10px] uppercase tracking-widest text-outline mb-4">
                Dinh dưỡng
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {[
                  { label: "Carbs", current: macros.c, target: macroTargets.c },
                  {
                    label: "Protein",
                    current: macros.p,
                    target: macroTargets.p,
                  },
                  { label: "Fat", current: macros.f, target: macroTargets.f },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="space-y-1.5 sm:space-y-2 min-w-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-0.5">
                      <span className="font-label-caps text-[9px] sm:text-[10px] font-bold text-primary uppercase">
                        {m.label}
                      </span>
                      <span className="font-numbers text-[10px] sm:text-xs">
                        {Math.round(m.current)}/{m.target}g
                      </span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((m.current / m.target) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="flex justify-between items-center px-1 mb-1">
              <h3 className="font-h2 text-base sm:text-lg text-primary font-bold">
                Bữa ăn hôm nay
              </h3>
            </div>
            {MEAL_ORDER.map((type, index) => (
              <motion.div
                key={type}
                custom={index + 2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <MealSection
                  mealType={type}
                  meal={getMeal(type)}
                  onAdd={openModal}
                  onRemoveIngredient={handleRemoveIngredient}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openModal("breakfast")}
        className="fixed bottom-20 right-4 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 z-40"
      >
        <span className="material-symbols-outlined text-3xl sm:text-4xl">
          add
        </span>
      </motion.button>

      <BottomNav />

      <AnimatePresence>
        {modalMeal && (
          <AddMealModal
            mealType={modalMeal}
            onClose={closeModal}
            onAdd={(ingredient) => handleAddIngredient(modalMeal, ingredient)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
