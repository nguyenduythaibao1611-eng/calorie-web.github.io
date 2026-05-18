"use client";

import { create } from "zustand";
import type { DailyLog, MealEntry, Ingredient } from "@/types";
import { getLog, saveLog } from "@/lib/storage";
import { calculateAndUpdateStreak } from "@/lib/updateStreak";

// ─── Helpers lấy / tạo userId ────────────────────────────────────────────────
// App chưa có auth → dùng một userId cố định lưu localStorage
function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem("calorie_userId");
  if (stored) return stored;
  const newId = crypto.randomUUID();
  localStorage.setItem("calorie_userId", newId);
  return newId;
}

// ─── Chuyển dữ liệu từ API sang cấu trúc MealEntry của store ─────────────────
type ApiMeal = {
  id: string;
  mealType: string;
  date: string;
  totalKcal: number;
  createdAt: string;
  ingredients: {
    id: string;
    amountInGram: number;
    ingredient: {
      id: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }[];
};

function apiMealToEntry(meal: ApiMeal): MealEntry {
  const ingredients: Ingredient[] = meal.ingredients.map((mi) => {
    const ratio = mi.amountInGram / 100;
    return {
      id: mi.ingredient.id,
      name: mi.ingredient.name,
      calories: Math.round(mi.ingredient.calories * ratio),
      protein: Math.round(mi.ingredient.protein * ratio * 10) / 10,
      carbs: Math.round(mi.ingredient.carbs * ratio * 10) / 10,
      fat: Math.round(mi.ingredient.fat * ratio * 10) / 10,
      amount: mi.amountInGram,
    };
  });

  const time = new Date(meal.createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: meal.id,
    mealType: meal.mealType as MealEntry["mealType"],
    ingredients,
    totalCalories: ingredients.reduce((s, i) => s + i.calories, 0),
    time,
  };
}

// ─── Chuyển Ingredient[] của store sang format API cần ───────────────────────
function ingredientsToApiPayload(
  ingredients: Ingredient[]
): { ingredientId: string; amountInGram: number }[] {
  return ingredients.map((ing) => ({
    ingredientId: ing.id,
    amountInGram: ing.amount ?? 100,
  }));
}

// ─── Sync lên API (fire-and-forget, không block UI) ──────────────────────────
async function syncAddMealToApi(
  mealType: string,
  date: string,
  ingredients: Ingredient[]
): Promise<string | null> {
  try {
    const userId = getOrCreateUserId();
    if (!userId) return null;

    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        mealType,
        date,
        ingredients: ingredientsToApiPayload(ingredients),
      }),
    });
    if (!res.ok) return null;
    const data = await res.json() as ApiMeal;
    return data.id;
  } catch {
    return null;
  }
}

async function syncDeleteMealFromApi(mealId: string): Promise<void> {
  try {
    await fetch(`/api/meals/${mealId}`, { method: "DELETE" });
  } catch {
    // Bỏ qua lỗi network, localStorage đã xóa rồi
  }
}

// ─── Kiểm tra mealId có phải UUID từ DB không ────────────────────────────────
function isDbId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);
}

// ─── Store Types ──────────────────────────────────────────────────────────────
type StreakCallback = (streak: { currentStreak: number; bestStreak: number }) => void;

type DiaryState = {
  currentLog: DailyLog | null;
  currentDate: string;
  loadLog: (date: string) => void;
  addMeal: (meal: MealEntry, onStreakUpdate?: StreakCallback) => void;
  removeMeal: (mealId: string, onStreakUpdate?: StreakCallback) => void;
  updateMeal: (mealId: string, updated: MealEntry, onStreakUpdate?: StreakCallback) => void;
  addIngredients: (
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    ingredients: Ingredient[],
    onStreakUpdate?: StreakCallback
  ) => void;
  removeIngredient: (mealId: string, ingredientId: string, onStreakUpdate?: StreakCallback) => void;
  updateWater: (water: number) => void;
};

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function calcTotalCalories(log: DailyLog): number {
  return log.meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useDiaryStore = create<DiaryState>((set, get) => ({
  currentLog: null,
  currentDate: getTodayDate(),

  // Load nhật ký: đọc localStorage trước (nhanh), sau đó fetch DB để đồng bộ
  loadLog: (date: string) => {
    const log = getLog(date) ?? { date, meals: [], totalCalories: 0, water: 0 };
    if (log.water === undefined) log.water = 0;
    set({ currentLog: log, currentDate: date });

    // Fetch từ DB bất đồng bộ để cập nhật nếu có dữ liệu mới hơn
    const userId = getOrCreateUserId();
    if (!userId) return;

    fetch(`/api/meals?userId=${userId}&date=${date}`)
      .then((res) => res.ok ? res.json() : null)
      .then((apiMeals: ApiMeal[] | null) => {
        if (!apiMeals || apiMeals.length === 0) return;
        const meals = apiMeals.map(apiMealToEntry);
        const updatedLog: DailyLog = {
          ...log,
          meals,
          totalCalories: meals.reduce((s, m) => s + m.totalCalories, 0),
        };
        saveLog(date, updatedLog);
        set({ currentLog: updatedLog });
      })
      .catch(() => {
        // Giữ nguyên dữ liệu localStorage nếu fetch lỗi
      });
  },

  // Thêm bữa ăn
  addMeal: (meal, onStreakUpdate) => {
    const { currentLog, currentDate } = get();
    if (!currentLog) return;

    const updated: DailyLog = {
      ...currentLog,
      meals: [...currentLog.meals, meal],
      totalCalories: 0,
    };
    updated.totalCalories = calcTotalCalories(updated);
    saveLog(currentDate, updated);
    set({ currentLog: updated });

    const streak = calculateAndUpdateStreak();
    onStreakUpdate?.(streak);
  },

  // Xóa bữa ăn
  removeMeal: (mealId, onStreakUpdate) => {
    const { currentLog, currentDate } = get();
    if (!currentLog) return;

    const updated: DailyLog = {
      ...currentLog,
      meals: currentLog.meals.filter((m) => m.id !== mealId),
      totalCalories: 0,
    };
    updated.totalCalories = calcTotalCalories(updated);
    saveLog(currentDate, updated);
    set({ currentLog: updated });

    // Xóa trên DB nếu là ID từ database
    if (isDbId(mealId)) {
      syncDeleteMealFromApi(mealId);
    }

    const streak = calculateAndUpdateStreak();
    onStreakUpdate?.(streak);
  },

  // Cập nhật bữa ăn
  updateMeal: (mealId, updatedMeal, onStreakUpdate) => {
    const { currentLog, currentDate } = get();
    if (!currentLog) return;

    const updated: DailyLog = {
      ...currentLog,
      meals: currentLog.meals.map((m) => (m.id === mealId ? updatedMeal : m)),
      totalCalories: 0,
    };
    updated.totalCalories = calcTotalCalories(updated);
    saveLog(currentDate, updated);
    set({ currentLog: updated });

    const streak = calculateAndUpdateStreak();
    onStreakUpdate?.(streak);
  },

  // Thêm nhiều món ăn cùng lúc
  addIngredients: (mealType, newIngredients, onStreakUpdate) => {
    const { currentLog, currentDate, addMeal } = get();
    if (!currentLog) return;
    if (newIngredients.length === 0) return;

    const existingMeal = currentLog.meals.find((m) => m.mealType === mealType);

    if (existingMeal) {
      let updatedIngredients = [...existingMeal.ingredients];

      for (const ingredient of newIngredients) {
        const existingIdx = updatedIngredients.findIndex((i) => i.name === ingredient.name);
        if (existingIdx >= 0) {
          const old = updatedIngredients[existingIdx];
          updatedIngredients[existingIdx] = {
            ...old,
            amount: (old.amount ?? 0) + (ingredient.amount ?? 0),
            calories: old.calories + ingredient.calories,
            protein: Math.round((old.protein + ingredient.protein) * 10) / 10,
            carbs: Math.round((old.carbs + ingredient.carbs) * 10) / 10,
            fat: Math.round((old.fat + ingredient.fat) * 10) / 10,
          };
        } else {
          updatedIngredients.push(ingredient);
        }
      }

      const updatedMeal: MealEntry = {
        ...existingMeal,
        ingredients: updatedIngredients,
        totalCalories: updatedIngredients.reduce((s, i) => s + i.calories, 0),
      };

      const updatedLog: DailyLog = {
        ...currentLog,
        meals: currentLog.meals.map((m) => (m.id === existingMeal.id ? updatedMeal : m)),
        totalCalories: 0,
      };
      updatedLog.totalCalories = calcTotalCalories(updatedLog);
      saveLog(currentDate, updatedLog);
      set({ currentLog: updatedLog });

      // Sync lên DB: xóa bữa cũ, tạo bữa mới với ingredients đã gộp
      if (isDbId(existingMeal.id)) {
        syncDeleteMealFromApi(existingMeal.id).then(() => {
          syncAddMealToApi(mealType, currentDate, updatedIngredients).then((newId) => {
            if (!newId) return;
            // Cập nhật id mới từ DB vào store
            const latest = get().currentLog;
            if (!latest) return;
            const refreshed: DailyLog = {
              ...latest,
              meals: latest.meals.map((m) =>
                m.id === existingMeal.id ? { ...m, id: newId } : m
              ),
            };
            saveLog(currentDate, refreshed);
            set({ currentLog: refreshed });
          });
        });
      } else {
        syncAddMealToApi(mealType, currentDate, updatedIngredients);
      }

      const streak = calculateAndUpdateStreak();
      onStreakUpdate?.(streak);
    } else {
      // Tạo bữa ăn mới
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const totalCalories = newIngredients.reduce((s, i) => s + i.calories, 0);
      const tempId = `${mealType}-${Date.now()}`;

      addMeal({ id: tempId, mealType, ingredients: newIngredients, totalCalories, time }, onStreakUpdate);

      // Sync lên DB và cập nhật id thật
      syncAddMealToApi(mealType, currentDate, newIngredients).then((dbId) => {
        if (!dbId) return;
        const latest = get().currentLog;
        if (!latest) return;
        const refreshed: DailyLog = {
          ...latest,
          meals: latest.meals.map((m) => (m.id === tempId ? { ...m, id: dbId } : m)),
        };
        saveLog(currentDate, refreshed);
        set({ currentLog: refreshed });
      });
    }
  },

  // Xóa món ăn khỏi bữa ăn
  removeIngredient: (mealId, ingredientId, onStreakUpdate) => {
    const { currentLog, currentDate, removeMeal } = get();
    if (!currentLog) return;

    const meal = currentLog.meals.find((m) => m.id === mealId);
    if (!meal) return;

    const updatedIngredients = meal.ingredients.filter((ing) => ing.id !== ingredientId);

    if (updatedIngredients.length === 0) {
      removeMeal(mealId, onStreakUpdate);
    } else {
      const updatedMeal: MealEntry = {
        ...meal,
        ingredients: updatedIngredients,
        totalCalories: updatedIngredients.reduce((s, i) => s + i.calories, 0),
      };

      const updatedLog: DailyLog = {
        ...currentLog,
        meals: currentLog.meals.map((m) => (m.id === mealId ? updatedMeal : m)),
        totalCalories: 0,
      };
      updatedLog.totalCalories = calcTotalCalories(updatedLog);
      saveLog(currentDate, updatedLog);
      set({ currentLog: updatedLog });

      const streak = calculateAndUpdateStreak();
      onStreakUpdate?.(streak);
    }
  },

  // Cập nhật lượng nước uống
  updateWater: (water) => {
    const { currentLog, currentDate } = get();
    if (!currentLog) return;

    const updated: DailyLog = { ...currentLog, water };
    saveLog(currentDate, updated);
    set({ currentLog: updated });
  },
}));