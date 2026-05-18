"use client";

import { useState } from "react";
import type { Ingredient } from "@/types";
import FOOD_DB from "@/lib/ingredients.json";

type FoodItem = (typeof FOOD_DB)[number];
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

const MEAL_META: Record<MealType, { label: string; icon: string }> = {
  breakfast: { label: "Bữa sáng", icon: "wb_sunny" },
  lunch: { label: "Bữa trưa", icon: "restaurant" },
  dinner: { label: "Bữa tối", icon: "bedtime" },
  snack: { label: "Ăn vặt", icon: "cookie" },
};

function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function calcNutrition(food: FoodItem, grams: number) {
  const r = grams / 100;
  return {
    calories: Math.round(food.calories * r),
    protein: Math.round(food.protein * r * 10) / 10,
    carbs: Math.round(food.carbs * r * 10) / 10,
    fat: Math.round(food.fat * r * 10) / 10,
  };
}

interface AddMealModalProps {
  mealType: MealType;
  existingIngredients?: Ingredient[];
  onClose: () => void;
  onSave: (ingredients: Ingredient[]) => void;
}

export default function AddMealModal({
  mealType,
  existingIngredients = [],
  onClose,
  onSave,
}: AddMealModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState("100");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Khởi tạo cart với các món đã có sẵn
  const [cart, setCart] = useState<Ingredient[]>(existingIngredients);

  const filtered =
    query.trim() === ""
      ? FOOD_DB
      : FOOD_DB.filter((f) =>
          removeAccents(f.name).includes(removeAccents(query.trim())),
        );

  const nutrition = selected
    ? calcNutrition(selected, Number(grams) || 0)
    : null;

  function handleAddToCart() {
    if (!selected || !grams || Number(grams) <= 0) return;
    const g = Number(grams);
    const n = calcNutrition(selected, g);
    const newIngredient = {
      id: `${selected.id}-${Date.now()}`,
      name: selected.name,
      calories: n.calories,
      protein: n.protein,
      carbs: n.carbs,
      fat: n.fat,
      amount: g,
    };

    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.name === newIngredient.name);
      if (existingIdx >= 0) {
        const copy = [...prev];
        const old = copy[existingIdx];
        copy[existingIdx] = {
          ...old,
          amount: (old.amount || 0) + g,
          calories: old.calories + n.calories,
          protein: Math.round((old.protein + n.protein) * 10) / 10,
          carbs: Math.round((old.carbs + n.carbs) * 10) / 10,
          fat: Math.round((old.fat + n.fat) * 10) / 10,
        };
        return copy;
      }
      return [...prev, newIngredient];
    });

    setSelected(null);
    setGrams("100");
    setExpandedId(null);
  }

  function handleRemoveFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function handleFoodClick(food: FoodItem) {
    setSelected(food);
    setExpandedId(food.id);
  }

  const totalCartCalories = cart.reduce((sum, item) => sum + item.calories, 0);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Thêm món vào ${MEAL_META[mealType].label}`}
        className="fixed bottom-0 left-0 right-0 z-[101] bg-background rounded-t-3xl max-h-[95vh] flex flex-col shadow-2xl md:top-1/2 md:left-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:w-[900px] md:max-w-[95vw] md:h-[85vh]"
      >
        <div className="flex justify-center pt-3 md:hidden">
          <div className="w-10 h-1 rounded-full bg-primary/20" />
        </div>

        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-primary/10">
          <h2 className="font-h2 text-lg font-bold text-on-background">
            Thêm món — {MEAL_META[mealType].label}
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center hover:bg-primary/15 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-base">
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* LEFT PANE */}
          <div className="flex-1 flex flex-col md:border-r border-primary/10 min-h-0">
            <div className="p-4 border-b border-primary/5">
              <div className="flex items-center gap-2.5 bg-surface-container-lowest rounded-xl border border-primary/15 px-3.5 py-2.5">
                <span className="material-symbols-outlined text-outline text-base">search</span>
                <input
                  type="text"
                  placeholder="Tìm nguyên liệu..."
                  value={query}
                  autoComplete="off"
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none font-body-md text-sm text-on-background placeholder:text-outline"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 pb-24 md:pb-4 custom-scrollbar">
              {filtered.length === 0 && (
                <p className="text-center text-outline text-sm py-6">Không tìm thấy nguyên liệu 😕</p>
              )}
              {filtered.map((food) => (
                <div key={food.id}>
                  <div
                    onClick={() => handleFoodClick(food)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl border cursor-pointer transition-all ${
                      expandedId === food.id
                        ? "bg-primary/8 border-primary/30"
                        : "bg-surface-container-lowest border-primary/10 hover:border-primary/30 hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-body-md font-semibold text-sm text-on-background">{food.name}</p>
                      <p className="font-numbers text-[11px] text-outline mt-0.5">
                        P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-numbers text-sm text-on-background">{food.calories} kcal</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-md border border-primary/20 hover:bg-primary/10 text-primary transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleFoodClick(food); }}
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                      </button>
                    </div>
                  </div>

                  {expandedId === food.id && (
                    <div className="mt-2 p-4 bg-surface-container-lowest rounded-xl border border-primary/12 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <p className="font-label-caps text-[11px] uppercase tracking-widest text-outline">Số lượng (gram)</p>
                        {nutrition && (
                          <span className="font-numbers font-bold text-sm text-primary">{nutrition.calories} kcal</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGrams((g) => String(Math.max(10, (Number(g) || 100) - 10)))}
                          className="w-10 h-10 rounded-full bg-primary/10 text-primary text-xl flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >−</button>
                        <div className="flex-1 flex items-end justify-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={grams}
                            onChange={(e) => setGrams(e.target.value)}
                            className="w-20 text-center font-numbers font-bold text-2xl text-primary bg-transparent outline-none border-b-2 border-primary/20 focus:border-primary pb-1 transition-colors"
                          />
                          <span className="font-numbers text-sm text-outline pb-1">g</span>
                        </div>
                        <button
                          onClick={() => setGrams((g) => String((Number(g) || 100) + 10))}
                          className="w-10 h-10 rounded-full bg-primary/10 text-primary text-xl flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >+</button>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => { setExpandedId(null); setSelected(null); setGrams("100"); }}
                          className="flex-1 py-2.5 rounded-xl font-body-md font-bold text-sm text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                        >Hủy</button>
                        <button
                          onClick={handleAddToCart}
                          disabled={!grams || Number(grams) <= 0}
                          className="flex-[2] py-2.5 rounded-xl font-body-md font-bold text-sm text-white bg-primary shadow-lg shadow-primary/25 disabled:opacity-40 hover:opacity-90 transition-all flex justify-center items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                          Thêm vào bữa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANE */}
          <div
            className={`w-full md:w-[320px] flex flex-col bg-surface-container-lowest md:border-none border-t border-primary/10 absolute md:static bottom-0 left-0 right-0 z-10 transition-transform ${
              cart.length > 0 ? "translate-y-0" : "translate-y-[120%] md:translate-y-0"
            }`}
          >
            <div className="p-4 border-b border-primary/10 flex items-center gap-3 bg-surface-container-low/50">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined filled-icon text-primary text-xl">{MEAL_META[mealType].icon}</span>
              </div>
              <div>
                <h3 className="font-h2 font-bold text-base text-on-background">{MEAL_META[mealType].label}</h3>
                <p className="font-numbers text-[11px] uppercase text-outline">Tổng: {totalCartCalories} KCAL</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[100px] max-h-[30vh] md:max-h-none">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-outline opacity-60">
                  <span className="material-symbols-outlined text-4xl mb-2">restaurant</span>
                  <p className="text-sm">Chưa chọn món nào</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="font-body-md font-semibold text-sm text-on-background truncate">{item.name}</p>
                      <p className="font-numbers text-[10px] text-outline">{item.amount}g • {item.calories} kcal</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-primary/10 bg-background md:bg-transparent">
              <div className="flex items-center justify-between mb-4">
                <span className="font-body-md text-sm text-outline">Tổng calo</span>
                <span className="font-numbers font-bold text-lg text-primary">{totalCartCalories} kcal</span>
              </div>
              <button
                onClick={() => onSave(cart)}
                disabled={cart.length === 0}
                className="w-full py-3.5 rounded-xl font-body-md font-bold text-base text-white bg-primary shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Lưu {MEAL_META[mealType].label.toLowerCase()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}