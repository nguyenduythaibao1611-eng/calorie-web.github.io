"use client";

import { create } from "zustand";
import type { DailyLog, MealEntry, Ingredient } from "@/types";
import { getLog, saveLog } from "@/lib/storage";
import { calculateAndUpdateStreak } from "@/lib/updateStreak";

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
  replaceMealIngredients: (
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    ingredients: Ingredient[],
    onStreakUpdate?: StreakCallback
  ) => void;
  updateWater: (water: number) => void;
};

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/** Làm tròn số đến 1 chữ số thập phân */
const roundMacro = (num: number) => Math.round(num * 10) / 10;

function calcTotalCalories(log: DailyLog): number {
  // Đảm bảo tổng calo luôn là số nguyên
  return Math.round(log.meals.reduce((sum, meal) => sum + meal.totalCalories, 0));
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  currentLog: null,
  currentDate: getTodayDate(),

  loadLog: (date: string) => {
    const log = getLog(date) ?? { date, meals: [], totalCalories: 0, water: 0 };
    if (log.water === undefined) log.water = 0;
    set({ currentLog: log, currentDate: date });
  },

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

    const streak = calculateAndUpdateStreak();
    onStreakUpdate?.(streak);
  },

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
            protein: roundMacro(old.protein + ingredient.protein),
            carbs: roundMacro(old.carbs + ingredient.carbs),
            fat: roundMacro(old.fat + ingredient.fat),
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

      const streak = calculateAndUpdateStreak();
      onStreakUpdate?.(streak);
    } else {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      
      // Làm tròn các chỉ số của nguyên liệu mới trước khi thêm
      const processedIngredients = newIngredients.map(ing => ({
        ...ing,
        protein: roundMacro(ing.protein),
        carbs: roundMacro(ing.carbs),
        fat: roundMacro(ing.fat)
      }));

      const totalCalories = processedIngredients.reduce((s, i) => s + i.calories, 0);
      const id = `${mealType}-${Date.now()}`;

      addMeal(
        { id, mealType, ingredients: processedIngredients, totalCalories, time },
        onStreakUpdate
      );
    }
  },

  // FIX: ingredientId có thể là ing.id hoặc ing.name (fallback).
  // Filter loại bỏ ingredient nếu id match HOẶC (id undefined và name match).
  removeIngredient: (mealId, ingredientId, onStreakUpdate) => {
    const { currentLog, currentDate, removeMeal } = get();
    if (!currentLog) return;

    const meal = currentLog.meals.find((m) => m.id === mealId);
    if (!meal) return;

    const updatedIngredients = meal.ingredients.filter((ing) => {
      if (ing.id) {
        // Nếu ingredient có id → so sánh theo id
        return ing.id !== ingredientId;
      } else {
        // Fallback: ingredient không có id → so sánh theo name
        return ing.name !== ingredientId;
      }
    });

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

  // Replace toàn bộ ingredients của một bữa — dùng khi lưu từ modal (tránh cộng dồn)
  replaceMealIngredients: (mealType, ingredients, onStreakUpdate) => {
    const { currentLog, currentDate, addMeal, removeMeal } = get();
    if (!currentLog) return;

    // Nếu cart rỗng → xóa meal đó đi
    if (ingredients.length === 0) {
      const existingMeal = currentLog.meals.find((m) => m.mealType === mealType);
      if (existingMeal) removeMeal(existingMeal.id, onStreakUpdate);
      return;
    }

    const totalCalories = ingredients.reduce((s, i) => s + i.calories, 0);
    const existingMeal = currentLog.meals.find((m) => m.mealType === mealType);

    if (existingMeal) {
      // Replace ingredients trong meal đã có, không cộng dồn
      const updatedMeal: MealEntry = {
        ...existingMeal,
        ingredients,
        totalCalories,
      };
      const updatedLog: DailyLog = {
        ...currentLog,
        meals: currentLog.meals.map((m) => (m.id === existingMeal.id ? updatedMeal : m)),
        totalCalories: 0,
      };
      updatedLog.totalCalories = calcTotalCalories(updatedLog);
      saveLog(currentDate, updatedLog);
      set({ currentLog: updatedLog });

      const streak = calculateAndUpdateStreak();
      onStreakUpdate?.(streak);
    } else {
      // Chưa có meal → tạo mới
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const id = `${mealType}-${Date.now()}`;
      addMeal({ id, mealType, ingredients, totalCalories, time }, onStreakUpdate);
    }
  },

  updateWater: (water) => {
    const { currentLog, currentDate } = get();
    if (!currentLog) return;

    const updated: DailyLog = { ...currentLog, water };
    saveLog(currentDate, updated);
    set({ currentLog: updated });
  },
}));