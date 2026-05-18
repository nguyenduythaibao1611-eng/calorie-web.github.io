"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useDiaryStore } from "@/store/diaryStore";
import { useProfileStore } from "@/store/profileStore";
import type { MealEntry, Ingredient } from "@/types";
import { AppShell } from "@/components/nav/AppShell";

const AddMealModal = dynamic(() => import("@/components/diary/AddMealModalV2"), {
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
  const [, m, d] = dateStr.split("-").map(Number);
  return {
    day: d,
    month: m,
    isToday: dateStr === getToday(),
  };
}

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
    <section className="glass-card rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              hasItems ? "bg-primary/12" : "bg-primary/6"
            }`}
          >
            <span
              className={`material-symbols-outlined text-xl ${
                hasItems ? "filled-icon text-primary" : "text-primary/50"
              }`}
            >
              {icon}
            </span>
          </div>
          <div>
            <p className="font-body-md font-bold text-base text-on-background">
              {label}
            </p>
            <p className="font-numbers text-[10px] uppercase tracking-wider text-outline mt-0.5">
              {hasItems
                ? `Tổng: ${meal.totalCalories.toLocaleString()} kcal`
                : "Chưa thêm món"}
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => onAdd(mealType)}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            hasItems
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-primary/10 text-primary"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </motion.button>
      </div>

      {hasItems && (
        <motion.div
          className="border-t border-primary/6 px-4 pb-3 pt-2 space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {meal.ingredients.map((ing) => (
            <div
              key={ing.id}
              className="flex items-center gap-3 py-2 border-b border-primary/4 last:border-0 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                <span className="text-lg" role="img" aria-label="món ăn">🍽️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-md font-semibold text-sm text-on-background truncate">
                  {ing.name}
                </p>
                <p className="font-numbers text-[10px] uppercase tracking-wider text-outline mt-0.5">
                  Khẩu phần: {ing.amount ?? 100}g
                </p>
              </div>
              <span className="font-numbers font-semibold text-sm text-primary shrink-0">
                {ing.calories.toLocaleString()}
                <span className="text-[10px] font-normal text-outline ml-0.5">kcal</span>
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
    </section>
  );
});

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
};

export default function DiaryPage() {
  const { currentLog, loadLog, addIngredients, removeIngredient } = useDiaryStore();
  const { profile, loadProfile, syncStreak } = useProfileStore();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(getToday);
  const [modalMeal, setModalMeal] = useState<MealType | null>(null);

  useEffect(() => {
    loadProfile();
    loadLog(getToday());
    syncStreak();
    queueMicrotask(() => setMounted(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted) loadLog(currentDate);
  }, [currentDate]);

  const today = getToday();

  const goBack = useCallback(() => setCurrentDate((d) => offsetDate(d, -1)), []);
  const goNext = useCallback(() => {
    setCurrentDate((d) => {
      const next = offsetDate(d, 1);
      return next > getToday() ? d : next;
    });
  }, []);

  const openModal = useCallback((type: MealType) => setModalMeal(type), []);
  const closeModal = useCallback(() => setModalMeal(null), []);

  const handleStreakUpdate = useCallback(() => { syncStreak(); }, [syncStreak]);

  const target = profile?.macroTarget?.calories ?? 2000;
  const consumed = currentLog?.totalCalories ?? 0;
  const remaining = target - consumed;

  function getMeal(type: MealType): MealEntry | undefined {
    return currentLog?.meals.find((m) => m.mealType === type);
  }

  const handleSaveIngredients = useCallback(
    (mealType: MealType, ingredients: Ingredient[]) => {
      addIngredients(mealType, ingredients, handleStreakUpdate);
      closeModal();
    },
    [addIngredients, handleStreakUpdate, closeModal]
  );

  const handleRemoveIngredient = useCallback(
    (mealId: string, ingredientId: string) => {
      removeIngredient(mealId, ingredientId, handleStreakUpdate);
    },
    [removeIngredient, handleStreakUpdate]
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
    <AppShell>
      <div className="bg-background text-on-background font-body-md min-h-screen">
        <main className="pt-16 pb-28 sm:pb-24 px-4 sm:px-6 max-w-[1100px] mx-auto">
          <nav className="flex items-center justify-center gap-4 sm:gap-8 my-4 sm:my-5">
            <motion.button
              onClick={goBack}
              className="p-2 hover:bg-surface-container rounded-full transition-colors group shrink-0"
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl text-outline group-hover:text-primary">
                chevron_left
              </span>
            </motion.button>
            <h2 className="font-h1 text-xl sm:text-3xl text-primary font-bold text-center leading-tight">
              {todayFlag ? "Hôm nay" : "Ngày"},{" "}
              <span className="font-numbers">{day}</span> tháng{" "}
              <span className="font-numbers">{month}</span>
            </h2>
            <motion.button
              onClick={goNext}
              disabled={isAfterToday}
              className="p-2 hover:bg-surface-container rounded-full transition-colors group disabled:opacity-30 shrink-0"
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl text-outline group-hover:text-primary">
                chevron_right
              </span>
            </motion.button>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
            <motion.div className="lg:col-span-7 space-y-4 sm:space-y-5" initial="hidden" animate="visible">
              <motion.section custom={0} variants={cardVariants} className="glass-card rounded-3xl p-4 sm:p-6">
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-outline mb-3">Tổng kết hôm nay</p>
                <div className="flex items-end gap-3 mb-5">
                  <span className={`font-numbers font-bold text-5xl sm:text-6xl leading-none tracking-tight ${remaining < 0 ? "text-error" : "text-primary"}`}>
                    {Math.abs(remaining).toLocaleString()}
                  </span>
                  <span className="font-numbers text-sm text-outline mb-2">kcal còn lại</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Đã nạp", value: consumed, pct: Math.min((consumed / (target || 1)) * 100, 100), opaque: false },
                    { label: "Mục tiêu", value: target, pct: 100, opaque: true },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">{row.label}</span>
                        <span className="font-numbers font-semibold text-sm text-primary">
                          {row.value.toLocaleString()}
                          <span className="text-[10px] font-normal text-outline ml-1">kcal</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${row.pct}%`, opacity: row.opaque ? 0.25 : 1 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section custom={1} variants={cardVariants} className="glass-card rounded-3xl p-4 sm:p-6">
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-outline mb-4">Dinh dưỡng</p>
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                  {[
                    { label: "Carbs", current: macros.c, target: macroTargets.c },
                    { label: "Protein", current: macros.p, target: macroTargets.p },
                    { label: "Fat", current: macros.f, target: macroTargets.f },
                  ].map((m) => (
                    <div key={m.label} className="space-y-1.5 sm:space-y-2 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-0.5">
                        <span className="font-label-caps text-[9px] sm:text-[10px] font-bold text-primary uppercase">{m.label}</span>
                        <span className="font-numbers text-[10px] sm:text-xs">{Math.round(m.current)}/{m.target}g</span>
                      </div>
                      <div className="h-1.5 sm:h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${Math.min((m.current / m.target) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </motion.div>

            <div className="lg:col-span-5 space-y-3">
              <div className="flex justify-between items-center px-1 mb-1">
                <h3 className="font-h2 text-base sm:text-lg text-primary font-bold">Bữa ăn hôm nay</h3>
              </div>
              {MEAL_ORDER.map((type, index) => (
                <motion.div key={type} custom={index + 2} variants={cardVariants} initial="hidden" animate="visible">
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
          onClick={() => openModal("breakfast")}
          className="fixed bottom-20 right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/35 z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
        >
          <span className="material-symbols-outlined text-2xl sm:text-3xl">add</span>
        </motion.button>

        {modalMeal && (
          <AddMealModal
            mealType={modalMeal}
            existingIngredients={getMeal(modalMeal)?.ingredients ?? []}
            onClose={closeModal}
            onSave={(ingredients) => handleSaveIngredients(modalMeal, ingredients)}
          />
        )}
      </div>
    </AppShell>
  );
}