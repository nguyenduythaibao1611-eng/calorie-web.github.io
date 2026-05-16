"use client";

import { create } from "zustand";
import type { DailyLog, MealEntry } from "@/types";
import { getLog, saveLog } from "@/lib/storage";
import { calculateAndUpdateStreak } from "@/lib/updateStreak";

type DiaryState = {
  currentLog: DailyLog | null;
  currentDate: string;
  loadLog: (date: string) => void;
  addMeal: (
    meal: MealEntry,
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => void;
  removeMeal: (
    mealId: string,
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => void;
  updateMeal: (
    mealId: string,
    updated: MealEntry,
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => void;
  addIngredients: (
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    ingredients: import("@/types").Ingredient[],
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => void;
  removeIngredient: (
    mealId: string,
    ingredientId: string,
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => void;
  updateWater: (water: number) => void;
};

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function calcTotalCalories(log: DailyLog): number {
  return log.meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  currentLog: null,
  currentDate: getTodayDate(),

  // Load nhật ký theo ngày từ localStorage
  loadLog: (date: string) => {
    const log = getLog(date) ?? {
      date,
      meals: [],
      totalCalories: 0,
      water: 0,
    };
    if (log.water === undefined) {
      log.water = 0;
    }
    set({ currentLog: log, currentDate: date });
  },

  // Thêm bữa ăn vào nhật ký
  addMeal: (
    meal: MealEntry,
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => {
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

    // Cập nhật streak khi thêm bữa ăn
    const streak = calculateAndUpdateStreak();
    if (onStreakUpdate) {
      onStreakUpdate(streak);
    }
  },

  // Xóa bữa ăn khỏi nhật ký
  removeMeal: (
    mealId: string,
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => {
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

    // Cập nhật streak khi xóa bữa ăn
    const streak = calculateAndUpdateStreak();
    if (onStreakUpdate) {
      onStreakUpdate(streak);
    }
  },

  // Cập nhật bữa ăn trong nhật ký
  updateMeal: (
    mealId: string,
    updatedMeal: MealEntry,
    onStreakUpdate?: (streak: {
      currentStreak: number;
      bestStreak: number;
    }) => void,
  ) => {
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

    // Cập nhật streak khi cập nhật bữa ăn
    const streak = calculateAndUpdateStreak();
    if (onStreakUpdate) {
      onStreakUpdate(streak);
    }
  },



  // Thêm nhiều món ăn cùng lúc
  addIngredients: (mealType, newIngredients, onStreakUpdate) => {
    const { currentLog, currentDate, addMeal } = get();
    if (!currentLog) return;
    if (newIngredients.length === 0) return;

    const existingMeal = currentLog.meals.find((m) => m.mealType === mealType);

    if (existingMeal) {
      // Bắt đầu với mảng nguyên liệu hiện có
      let updatedIngredients = [...existingMeal.ingredients];

      for (const ingredient of newIngredients) {
        const existingIngIndex = updatedIngredients.findIndex(
          (i) => i.name === ingredient.name
        );

        if (existingIngIndex >= 0) {
          // Gộp món
          const old = updatedIngredients[existingIngIndex];
          updatedIngredients[existingIngIndex] = {
            ...old,
            amount: (old.amount || 0) + (ingredient.amount || 0),
            calories: old.calories + ingredient.calories,
            protein: Math.round((old.protein + ingredient.protein) * 10) / 10,
            carbs: Math.round((old.carbs + ingredient.carbs) * 10) / 10,
            fat: Math.round((old.fat + ingredient.fat) * 10) / 10,
          };
        } else {
          // Thêm mới
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
        meals: currentLog.meals.map((m) =>
          m.id === existingMeal.id ? updatedMeal : m
        ),
        totalCalories: 0,
      };
      updatedLog.totalCalories = calcTotalCalories(updatedLog);
      saveLog(currentDate, updatedLog);
      set({ currentLog: updatedLog });

      const streak = calculateAndUpdateStreak();
      if (onStreakUpdate) onStreakUpdate(streak);
    } else {
      // Tạo bữa ăn mới
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      
      const totalCalories = newIngredients.reduce((s, i) => s + i.calories, 0);

      addMeal(
        {
          id: `${mealType}-${Date.now()}`,
          mealType,
          ingredients: newIngredients,
          totalCalories,
          time,
        },
        onStreakUpdate
      );
    }
  },

  // Xóa món ăn khỏi bữa ăn
  removeIngredient: (mealId, ingredientId, onStreakUpdate) => {
    const { currentLog, currentDate, removeMeal } = get();
    if (!currentLog) return;

    const meal = currentLog.meals.find((m) => m.id === mealId);
    if (!meal) return;

    const updatedIngredients = meal.ingredients.filter(
      (ing) => ing.id !== ingredientId
    );

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
      if (onStreakUpdate) onStreakUpdate(streak);
    }
  },

  // Cập nhật lượng nước uống
  updateWater: (water: number) => {
    const { currentLog, currentDate } = get();
    if (!currentLog) return;

    const updated: DailyLog = {
      ...currentLog,
      water,
    };
    saveLog(currentDate, updated);
    set({ currentLog: updated });
  },
}));
