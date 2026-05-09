'use client';

import { useEffect, useState } from 'react';
import {
  Flame, Settings, CalendarDays,
  Sun, UtensilsCrossed, Moon, Cookie,
  PlusCircle, Plus, ArrowLeft, Trash2, Search,
  BookOpen, Home, BarChart2,
} from 'lucide-react';
import { useDiaryStore } from '@/store/diaryStore';
import type { Ingredient, MealEntry } from '@/types';

// ── Dữ liệu nguyên liệu ───────────────────────────────────────────────────────
const INGREDIENTS_DB = [
  { name: 'Cơm trắng',            calories: 130, protein: 2.7, carbs: 28,  fat: 0.3 },
  { name: 'Thịt gà (ức)',         calories: 165, protein: 31,  carbs: 0,   fat: 3.6 },
  { name: 'Thịt bò',              calories: 250, protein: 26,  carbs: 0,   fat: 15  },
  { name: 'Thịt lợn nạc',         calories: 143, protein: 22,  carbs: 0,   fat: 6   },
  { name: 'Trứng gà',             calories: 155, protein: 13,  carbs: 1.1, fat: 11  },
  { name: 'Cá hồi',               calories: 208, protein: 20,  carbs: 0,   fat: 13  },
  { name: 'Tôm',                  calories: 99,  protein: 24,  carbs: 0.2, fat: 0.3 },
  { name: 'Đậu phụ',              calories: 76,  protein: 8,   carbs: 1.9, fat: 4.8 },
  { name: 'Sữa tươi',             calories: 61,  protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: 'Bánh mì',              calories: 265, protein: 9,   carbs: 49,  fat: 3.2 },
  { name: 'Phở bò',               calories: 90,  protein: 6.5, carbs: 12,  fat: 1.8 },
  { name: 'Bún chả',              calories: 120, protein: 9,   carbs: 14,  fat: 3.5 },
  { name: 'Gỏi cuốn',             calories: 100, protein: 4,   carbs: 16,  fat: 2   },
  { name: 'Khoai lang',           calories: 86,  protein: 1.6, carbs: 20,  fat: 0.1 },
  { name: 'Sữa chua không đường', calories: 59,  protein: 10,  carbs: 3.6, fat: 0.4 },
];

const MEAL_CONFIG = [
  { type: 'breakfast' as const, label: 'Bữa sáng', Icon: Sun,            activeBg: '#caeadd' },
  { type: 'lunch'     as const, label: 'Bữa trưa', Icon: UtensilsCrossed, activeBg: '#e8f0eb' },
  { type: 'dinner'    as const, label: 'Bữa tối',  Icon: Moon,            activeBg: '#e8f0eb' },
  { type: 'snack'     as const, label: 'Ăn vặt',   Icon: Cookie,          activeBg: '#e8f0eb' },
];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getTodayLabel() {
  return new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function AddModal({ mealLabel, onClose, onAdd }: {
  mealLabel: string;
  onClose: () => void;
  onAdd: (ing: Ingredient) => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof INGREDIENTS_DB[number] | null>(null);
  const [gram, setGram] = useState(100);

  const filtered = INGREDIENTS_DB.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const preview = selected ? Math.round((selected.calories / 100) * gram) : 0;

  function handleAdd() {
    if (!selected || gram <= 0) return;
    onAdd({
      id: crypto.randomUUID(),
      name: selected.name,
      calories: Math.round((selected.calories / 100) * gram),
      protein: +((selected.protein / 100) * gram).toFixed(1),
      carbs:   +((selected.carbs   / 100) * gram).toFixed(1),
      fat:     +((selected.fat     / 100) * gram).toFixed(1),
      amount:  gram,
    });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div style={{ width: '100%', maxWidth: 520, borderRadius: '20px 20px 0 0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '85vh', background: 'rgba(244,251,246,0.97)', border: '1px solid rgba(26,107,78,0.12)', boxShadow: '0 -20px 60px rgba(26,107,78,0.15)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 700, fontSize: 20, color: '#161d1a' }}>
            Thêm vào {mealLabel}
          </span>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f0eb', border: 'none', cursor: 'pointer' }}>
            <Plus size={18} color="#3f4943" style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#3f4943" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm nguyên liệu..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
            style={{ width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, border: '1px solid rgba(26,107,78,0.2)', background: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 15, color: '#161d1a', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Bước 1 – chọn nguyên liệu */}
        {!selected && (
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.length === 0 && (
              <p style={{ textAlign: 'center', color: '#3f4943', padding: '24px 0', fontFamily: 'var(--font-be-vietnam-pro)' }}>Không tìm thấy</p>
            )}
            {filtered.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelected(item)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 600, color: '#161d1a', margin: 0 }}>{item.name}</p>
                  <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13, color: '#3f4943', margin: 0 }}>
                    P {item.protein}g · C {item.carbs}g · F {item.fat}g
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, color: '#005239', marginLeft: 16, flexShrink: 0 }}>
                  {item.calories} kcal/100g
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Bước 2 – nhập gram */}
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button
              onClick={() => setSelected(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#005239', cursor: 'pointer', fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 14 }}
            >
              <ArrowLeft size={16} />
              Chọn lại
            </button>

            <div style={{ borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(26,107,78,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 700, fontSize: 17, color: '#161d1a', margin: '0 0 4px' }}>{selected.name}</p>
              <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13, color: '#3f4943', margin: 0 }}>
                {selected.calories} kcal · P {selected.protein}g · C {selected.carbs}g · F {selected.fat}g / 100g
              </p>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13, color: '#3f4943', display: 'block', marginBottom: 6 }}>Số gram</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  value={gram}
                  onChange={(e) => setGram(Number(e.target.value))}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(26,107,78,0.2)', background: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 18, color: '#161d1a', outline: 'none' }}
                />
                <span style={{ fontFamily: 'var(--font-be-vietnam-pro)', color: '#3f4943' }}>gram</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: '12px 16px', background: 'rgba(26,107,78,0.08)' }}>
              <span style={{ fontFamily: 'var(--font-be-vietnam-pro)', color: '#161d1a' }}>Calories tính được</span>
              <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, color: '#005239' }}>{preview} kcal</span>
            </div>

            <button
              onClick={handleAdd}
              disabled={gram <= 0}
              style={{ width: '100%', padding: '14px 0', borderRadius: 9999, background: '#005239', color: '#fff', border: 'none', cursor: gram > 0 ? 'pointer' : 'not-allowed', opacity: gram > 0 ? 1 : 0.4, fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Plus size={20} />
              Thêm vào nhật ký
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Meal Section ──────────────────────────────────────────────────────────────
function MealSection({ config, meal, onOpenModal, onRemove }: {
  config: typeof MEAL_CONFIG[number];
  meal: MealEntry | undefined;
  onOpenModal: () => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasItems = !!meal?.ingredients?.length;
  const total = meal?.totalCalories ?? 0;
  const { Icon } = config;

  return (
    <section style={{ borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(26,107,78,0.12)', boxShadow: '0 10px 30px rgba(26,107,78,0.06)' }}>
      {/* Header */}
      <div
        onClick={() => hasItems && setExpanded((v) => !v)}
        style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: hasItems ? 'pointer' : 'default', borderBottom: hasItems && expanded ? '1px solid rgba(26,107,78,0.05)' : undefined }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: config.activeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} color="#005239" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 600, fontSize: 22, color: '#161d1a', margin: 0, lineHeight: 1.2 }}>{config.label}</h2>
            <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943', margin: 0 }}>
              {total} kcal {hasItems ? (expanded ? '▲' : '▼') : ''}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
          style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(26,107,78,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          <PlusCircle size={24} color="#005239" />
        </button>
      </div>

      {/* Ingredients list */}
      {expanded && hasItems && (
        <div style={{ padding: '16px 20px', background: 'rgba(238,245,240,0.5)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {meal!.ingredients.map((ing, idx) => (
            <div key={ing.id}>
              {idx > 0 && <div style={{ height: 1, background: 'rgba(26,107,78,0.05)', marginBottom: 12 }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 600, color: '#161d1a', margin: 0 }}>{ing.name}</p>
                  <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13, color: '#3f4943', margin: 0 }}>{ing.amount}g</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, fontSize: 20, color: '#005239' }}>{ing.calories} kcal</span>
                  <button
                    onClick={() => onRemove(ing.id)}
                    style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(186,26,26,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Trash2 size={16} color="#ba1a1a" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DiaryPage() {
  const { currentLog, loadLog, addMeal, updateMeal, removeMeal } = useDiaryStore();
  const [openModal, setOpenModal] = useState<MealEntry['mealType'] | null>(null);

  useEffect(() => {
    loadLog(getToday());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalCalories = currentLog?.totalCalories ?? 0;
  const TARGET = 2000;
  const remaining = TARGET - totalCalories;

  function getMeal(type: MealEntry['mealType']) {
    return currentLog?.meals.find((m) => m.mealType === type);
  }

  function handleAdd(mealType: MealEntry['mealType'], ingredient: Ingredient) {
    const meal = getMeal(mealType);
    if (meal) {
      const ings = [...meal.ingredients, ingredient];
      updateMeal(meal.id, { ...meal, ingredients: ings, totalCalories: ings.reduce((s, i) => s + i.calories, 0) });
    } else {
      addMeal({ id: crypto.randomUUID(), mealType, ingredients: [ingredient], totalCalories: ingredient.calories, time: new Date().toTimeString().slice(0, 5) });
    }
    setOpenModal(null);
  }

  function handleRemove(mealType: MealEntry['mealType'], ingId: string) {
    const meal = getMeal(mealType);
    if (!meal) return;
    const ings = meal.ingredients.filter((i) => i.id !== ingId);
    if (ings.length === 0) { removeMeal(meal.id); return; }
    updateMeal(meal.id, { ...meal, ingredients: ings, totalCalories: ings.reduce((s, i) => s + i.calories, 0) });
  }

  return (
    <div style={{ background: '#f4fbf6', minHeight: '100vh', paddingBottom: 120 }}>

      {/* TopAppBar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(26,107,78,0.1)', boxShadow: '0 10px 30px rgba(26,107,78,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Flame size={24} color="#003d2b" />
          <span style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 900, fontSize: 22, color: '#003d2b', letterSpacing: '-0.02em' }}>CaloMate</span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Settings size={22} color="#003d2b" />
        </button>
      </header>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '24px 20px 0' }}>

        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.02em', color: '#005239', margin: '0 0 8px' }}>
            Nhật ký ăn uống
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3f4943' }}>
            <CalendarDays size={16} color="#3f4943" />
            <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {getTodayLabel()}
            </span>
          </div>
        </div>

        {/* Bento Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(26,107,78,0.12)', boxShadow: '0 10px 30px rgba(26,107,78,0.06)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 120 }}>
            <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943' }}>Còn lại</span>
            <div style={{ marginTop: 8 }}>
              <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 40, letterSpacing: '-0.03em', color: '#005239', lineHeight: 1 }}>
                {remaining.toLocaleString()}
              </span>
              <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 12, color: '#3f4943', marginLeft: 4 }}>kcal</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
            {[{ label: 'Đã ăn', value: totalCalories }, { label: 'Mục tiêu', value: TARGET }].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(26,107,78,0.12)', boxShadow: '0 10px 30px rgba(26,107,78,0.06)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, fontSize: 20, color: '#48645a' }}>{value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {MEAL_CONFIG.map((cfg) => (
            <MealSection
              key={cfg.type}
              config={cfg}
              meal={getMeal(cfg.type)}
              onOpenModal={() => setOpenModal(cfg.type)}
              onRemove={(id) => handleRemove(cfg.type, id)}
            />
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setOpenModal('breakfast')}
            style={{ background: '#005239', color: '#fff', padding: '16px 48px', borderRadius: 9999, fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 600, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(26,107,78,0.25)', border: 'none', cursor: 'pointer' }}
          >
            <Plus size={22} />
            Thêm món ăn
          </button>
        </div>
      </main>

      {/* BottomNav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(26,107,78,0.1)', boxShadow: '0 -10px 30px rgba(26,107,78,0.06)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '16px 24px 32px' }}>
        {[
          { Icon: Home,      label: 'Tổng quan', active: false },
          { Icon: BookOpen,  label: 'Nhật ký',   active: true  },
          { Icon: BarChart2, label: 'Thống kê',  active: false },
        ].map(({ Icon: NavIcon, label, active }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <div style={{ padding: 12, borderRadius: 9999, background: active ? 'rgba(26,107,78,0.12)' : 'transparent', transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s' }}>
              <NavIcon size={22} color={active ? '#005239' : 'rgba(26,58,42,0.4)'} />
            </div>
            <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? '#005239' : 'rgba(26,58,42,0.4)', fontWeight: active ? 700 : 400 }}>
              {label}
            </span>
          </div>
        ))}
      </nav>

      {/* Modal */}
      {openModal && (
        <AddModal
          mealLabel={MEAL_CONFIG.find((c) => c.type === openModal)!.label}
          onClose={() => setOpenModal(null)}
          onAdd={(ing) => handleAdd(openModal, ing)}
        />
      )}
    </div>
  );
}