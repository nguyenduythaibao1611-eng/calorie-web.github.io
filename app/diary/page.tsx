'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Flame, Settings, Sun, Moon,
  UtensilsCrossed, Cookie, Home, BookOpen, BarChart2,
  ChevronRight, Plus, Minus, Droplets, User,
} from 'lucide-react';
import { useDiaryStore } from '@/store/diaryStore';
import { useProfileStore } from '@/store/profileStore';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Đêm khuya rồi 🌙', sub: 'Nhớ nghỉ ngơi đủ giấc nhé' };
  if (h < 11) return { text: 'Chào buổi sáng ☀️', sub: 'Hãy bắt đầu ngày mới thật tốt' };
  if (h < 13) return { text: 'Bữa trưa chưa? 🍱', sub: 'Đừng bỏ bữa, cơ thể cần năng lượng' };
  if (h < 18) return { text: 'Buổi chiều năng động 💪', sub: 'Giữ vững mục tiêu của bạn' };
  return       { text: 'Chào buổi tối 🌆', sub: 'Tổng kết một ngày nào' };
}

const WATER_TARGET = 8;

// ─────────────────────────────────────────────────────────────────────────────
// Calorie Ring
// ─────────────────────────────────────────────────────────────────────────────

function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const SIZE = 196, STROKE = 14;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const pct = Math.min(consumed / (target || 1), 1);
  const over = consumed > target;
  const stroke = over ? '#ba1a1a' : '#005239';

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
      <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none"
          stroke="rgba(26,107,78,0.1)" strokeWidth={STROKE} />
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none"
          stroke={stroke} strokeWidth={STROKE}
          strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1), stroke 0.3s' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 34,
          color: over ? '#ba1a1a' : '#005239', lineHeight: 1, letterSpacing: '-0.03em',
        }}>
          {consumed.toLocaleString()}
        </span>
        <span style={{
          fontFamily: 'var(--font-space-grotesk)', fontSize: 11,
          color: '#3f4943', letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          / {target.toLocaleString()} kcal
        </span>
        {over && (
          <span style={{
            fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 11,
            color: '#ba1a1a', fontWeight: 600, marginTop: 2,
          }}>⚠️ Vượt mục tiêu</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Macro Bar
// ─────────────────────────────────────────────────────────────────────────────

function MacroBar({ label, value, target, color }: {
  label: string; value: number; target: number; color: string;
}) {
  const pct = Math.min((value / (target || 1)) * 100, 100);
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{
          fontFamily: 'var(--font-space-grotesk)', fontSize: 10,
          letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943',
        }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, fontSize: 13, color: '#161d1a' }}>
          {value.toFixed(0)}
          <span style={{ fontWeight: 400, color: '#3f4943', fontSize: 10 }}>/{target}g</span>
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 9999, background: 'rgba(26,107,78,0.1)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 9999, width: `${pct}%`, background: color,
          transition: 'width 0.9s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Meal Row
// ─────────────────────────────────────────────────────────────────────────────

const MEAL_META = {
  breakfast: { label: 'Bữa sáng', Icon: Sun },
  lunch:     { label: 'Bữa trưa', Icon: UtensilsCrossed },
  dinner:    { label: 'Bữa tối',  Icon: Moon },
  snack:     { label: 'Ăn vặt',   Icon: Cookie },
} as const;

function MealRow({ mealType, calories, itemCount }: {
  mealType: keyof typeof MEAL_META; calories: number; itemCount: number;
}) {
  const { label, Icon } = MEAL_META[mealType];
  return (
    <Link href="/diary" style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 0', borderBottom: '1px solid rgba(26,107,78,0.06)', cursor: 'pointer',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(26,107,78,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} color="#005239" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 600, fontSize: 14, color: '#161d1a', margin: 0 }}>
            {label}
          </p>
          <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 11, color: '#3f4943', margin: '1px 0 0' }}>
            {itemCount === 0 ? 'Chưa có món nào' : `${itemCount} món`}
          </p>
        </div>
        <span style={{
          fontFamily: 'var(--font-space-grotesk)', fontWeight: 600,
          fontSize: 15, color: calories > 0 ? '#005239' : '#aab9b3',
        }}>
          {calories > 0 ? `${calories.toLocaleString()} kcal` : '—'}
        </span>
        <ChevronRight size={15} color="#aab9b3" />
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Water Tracker
// ─────────────────────────────────────────────────────────────────────────────

function WaterTracker({ glasses, onAdd, onRemove }: {
  glasses: number; onAdd: () => void; onRemove: () => void;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(26,107,78,0.12)',
      boxShadow: '0 10px 30px rgba(26,107,78,0.06)',
      borderRadius: 20, padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-space-grotesk)', fontSize: 11,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943', margin: '0 0 2px',
          }}>Nước uống hôm nay</p>
          <p style={{
            fontFamily: 'var(--font-space-grotesk)', fontWeight: 700,
            fontSize: 22, color: '#005239', margin: 0, letterSpacing: '-0.02em',
          }}>
            {glasses}
            <span style={{ fontWeight: 400, fontSize: 13, color: '#3f4943', marginLeft: 4 }}>
              / {WATER_TARGET} ly
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onRemove} disabled={glasses === 0}
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(26,107,78,0.08)', border: 'none',
              cursor: glasses === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: glasses === 0 ? 0.4 : 1, transition: 'all 0.2s',
            }}
          >
            <Minus size={16} color="#005239" />
          </button>
          <button
            onClick={onAdd} disabled={glasses >= WATER_TARGET}
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: glasses >= WATER_TARGET ? 'rgba(26,107,78,0.08)' : '#005239',
              border: 'none', cursor: glasses >= WATER_TARGET ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: glasses >= WATER_TARGET ? 0.4 : 1, transition: 'all 0.2s',
            }}
          >
            <Plus size={16} color={glasses >= WATER_TARGET ? '#005239' : '#fff'} />
          </button>
        </div>
      </div>

      {/* Glass grid */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Array.from({ length: WATER_TARGET }).map((_, i) => (
          <div
            key={i}
            onClick={() => (i < glasses ? onRemove() : onAdd())}
            style={{
              width: 32, height: 36, borderRadius: 6, cursor: 'pointer',
              background: i < glasses ? '#005239' : 'rgba(26,107,78,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <Droplets size={14} color={i < glasses ? '#caeadd' : 'rgba(26,107,78,0.3)'} />
          </div>
        ))}
      </div>

      {glasses >= WATER_TARGET && (
        <p style={{
          fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 12,
          color: '#005239', fontWeight: 600, margin: '10px 0 0', textAlign: 'center',
        }}>
          🎉 Đủ nước rồi! Tuyệt vời!
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { currentLog, loadLog, updateWater } = useDiaryStore();
  const { profile, loadProfile } = useProfileStore();
  const today                    = getToday();
  const [mounted, setMounted]    = useState(false);

  const water = currentLog?.water ?? 0;

  // ── Load everything from storage on mount ──
  useEffect(() => {
    loadProfile();
    loadLog(today);
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addWater = useCallback(() => {
    updateWater(Math.min(water + 1, WATER_TARGET));
  }, [water, updateWater]);

  const removeWater = useCallback(() => {
    updateWater(Math.max(water - 1, 0));
  }, [water, updateWater]);

  // ── Derived calorie data ──
  const target    = profile?.macroTarget?.calories ?? 2000;
  const consumed  = currentLog?.totalCalories ?? 0;
  const remaining = target - consumed;

  // ── Macro totals from all ingredients ──
  const macros = useMemo(() => {
    const init = { protein: 0, carbs: 0, fat: 0 };
    if (!currentLog) return init;
    return currentLog.meals.reduce((acc, meal) => {
      meal.ingredients.forEach((ing) => {
        acc.protein += ing.protein;
        acc.carbs   += ing.carbs;
        acc.fat     += ing.fat;
      });
      return acc;
    }, { ...init });
  }, [currentLog]);

  const macroTarget = {
    protein: profile?.macroTarget?.protein ?? 150,
    carbs:   profile?.macroTarget?.carbs   ?? 250,
    fat:     profile?.macroTarget?.fat     ?? 65,
  };

  function mealInfo(type: keyof typeof MEAL_META) {
    const meal = currentLog?.meals.find((m) => m.mealType === type);
    return { calories: meal?.totalCalories ?? 0, itemCount: meal?.ingredients?.length ?? 0 };
  }

  const greeting = getGreeting();

  // Prevent SSR hydration mismatch (localStorage only on client)
  if (!mounted) return null;

  return (
    <div style={{ background: '#f4fbf6', minHeight: '100vh', paddingBottom: 120 }}>

      {/* ── TopAppBar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(26,107,78,0.1)',
        boxShadow: '0 10px 30px rgba(26,107,78,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Flame size={24} color="#003d2b" />
          <span style={{
            fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 900,
            fontSize: 22, color: '#003d2b', letterSpacing: '-0.02em',
          }}>CaloMate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {profile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(26,107,78,0.08)', borderRadius: 9999, padding: '6px 12px',
            }}>
              <User size={14} color="#005239" />
              <span style={{
                fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13,
                fontWeight: 600, color: '#005239',
              }}>
                {profile.name ?? 'Bạn'}
              </span>
            </div>
          )}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Settings size={22} color="#003d2b" />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '24px 20px 0' }}>

        {/* ── Greeting ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 700,
            fontSize: 26, letterSpacing: '-0.02em', color: '#005239', margin: '0 0 4px',
          }}>
            {greeting.text}
          </h1>
          <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 14, color: '#3f4943', margin: 0 }}>
            {greeting.sub}
          </p>
        </div>

        {/* ── No-profile warning ── */}
        {!profile && (
          <div style={{
            background: 'rgba(255,237,213,0.8)', borderRadius: 14,
            border: '1px solid rgba(194,120,3,0.2)',
            padding: '14px 18px', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <p style={{ fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13, color: '#7c4a00', margin: 0, fontWeight: 500 }}>
              ⚠️ Chưa có hồ sơ — đang dùng mặc định 2000 kcal
            </p>
            <Link href="/onboarding" style={{
              fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 12,
              fontWeight: 700, color: '#7c4a00', textDecoration: 'underline', whiteSpace: 'nowrap',
            }}>
              Thiết lập →
            </Link>
          </div>
        )}

        {/* ── Calorie Hero ── */}
        <div style={{
          background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(26,107,78,0.12)',
          boxShadow: '0 10px 30px rgba(26,107,78,0.08)',
          borderRadius: 20, padding: 24,
          display: 'flex', alignItems: 'center', gap: 24,
          marginBottom: 14, flexWrap: 'wrap',
        }}>
          <CalorieRing consumed={consumed} target={target} />

          <div style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-space-grotesk)', fontSize: 10,
                letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943', margin: '0 0 4px',
              }}>
                {remaining >= 0 ? 'Còn lại hôm nay' : 'Đã vượt mục tiêu'}
              </p>
              <p style={{
                fontFamily: 'var(--font-space-grotesk)', fontWeight: 700,
                fontSize: 30, letterSpacing: '-0.03em', lineHeight: 1,
                color: remaining < 0 ? '#ba1a1a' : '#161d1a', margin: 0,
              }}>
                {Math.abs(remaining).toLocaleString()}
                <span style={{ fontSize: 13, fontWeight: 400, color: '#3f4943', marginLeft: 6 }}>kcal</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Đã ăn',    value: `${consumed.toLocaleString()} kcal` },
                { label: 'Mục tiêu', value: `${target.toLocaleString()} kcal` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  borderRadius: 10, padding: '7px 12px',
                  background: 'rgba(26,107,78,0.06)', border: '1px solid rgba(26,107,78,0.1)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-space-grotesk)', fontSize: 9,
                    textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3f4943', margin: '0 0 1px',
                  }}>{label}</p>
                  <p style={{
                    fontFamily: 'var(--font-space-grotesk)', fontWeight: 600,
                    fontSize: 13, color: '#005239', margin: 0,
                  }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Macro Card ── */}
        <div style={{
          background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(26,107,78,0.12)',
          boxShadow: '0 10px 30px rgba(26,107,78,0.06)',
          borderRadius: 20, padding: '20px 24px', marginBottom: 14,
        }}>
          <p style={{
            fontFamily: 'var(--font-space-grotesk)', fontSize: 11,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943', margin: '0 0 16px',
          }}>Macro hôm nay</p>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <MacroBar label="Protein" value={macros.protein} target={macroTarget.protein} color="#005239" />
            <MacroBar label="Carbs"   value={macros.carbs}   target={macroTarget.carbs}   color="#3d8a68" />
            <MacroBar label="Fat"     value={macros.fat}     target={macroTarget.fat}      color="#7fbfa3" />
          </div>
        </div>

        {/* ── Water Tracker ── */}
        <div style={{ marginBottom: 14 }}>
          <WaterTracker glasses={water} onAdd={addWater} onRemove={removeWater} />
        </div>

        {/* ── Meals Today ── */}
        <div style={{
          background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(26,107,78,0.12)',
          boxShadow: '0 10px 30px rgba(26,107,78,0.06)',
          borderRadius: 20, padding: '20px 24px', marginBottom: 28,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4,
          }}>
            <p style={{
              fontFamily: 'var(--font-space-grotesk)', fontSize: 11,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3f4943', margin: 0,
            }}>Bữa ăn hôm nay</p>
            <Link href="/diary" style={{
              fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13,
              color: '#005239', textDecoration: 'none', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              Xem chi tiết <ChevronRight size={14} />
            </Link>
          </div>

          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type, i, arr) => {
            const { calories, itemCount } = mealInfo(type);
            return (
              <div key={type} style={i === arr.length - 1 ? { borderBottom: 'none' } : undefined}>
                <MealRow mealType={type} calories={calories} itemCount={itemCount} />
              </div>
            );
          })}

          {/* Empty state */}
          {(currentLog?.meals.length ?? 0) === 0 && (
            <p style={{
              fontFamily: 'var(--font-be-vietnam-pro)', fontSize: 13,
              color: '#3f4943', textAlign: 'center', padding: '8px 0 0', margin: 0,
            }}>
              Chưa có gì — hãy ghi lại bữa ăn đầu tiên! 🍽️
            </p>
          )}
        </div>

        {/* ── CTA ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <Link href="/diary" style={{ textDecoration: 'none' }}>
            <button style={{
              background: '#005239', color: '#fff',
              padding: '15px 44px', borderRadius: 9999,
              fontFamily: 'var(--font-be-vietnam-pro)', fontWeight: 600, fontSize: 17,
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 32px rgba(26,107,78,0.25)',
              border: 'none', cursor: 'pointer',
            }}>
              <Plus size={21} />
              Ghi nhật ký
            </button>
          </Link>
        </div>

      </main>

      {/* ── BottomNav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50,
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(26,107,78,0.1)',
        boxShadow: '0 -10px 30px rgba(26,107,78,0.06)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '16px 24px 32px',
      }}>
        {[
          { Icon: Home,      label: 'Tổng quan', href: '/',      active: true  },
          { Icon: BookOpen,  label: 'Nhật ký',   href: '/diary', active: false },
          { Icon: BarChart2, label: 'Thống kê',  href: '/stats', active: false },
        ].map(({ Icon: NavIcon, label, href, active }) => (
          <Link key={label} href={href} style={{
            textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <div style={{
              padding: 12, borderRadius: 9999,
              background: active ? 'rgba(26,107,78,0.12)' : 'transparent',
              transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s',
            }}>
              <NavIcon size={22} color={active ? '#005239' : 'rgba(26,58,42,0.4)'} />
            </div>
            <span style={{
              fontFamily: 'var(--font-space-grotesk)', fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: active ? '#005239' : 'rgba(26,58,42,0.4)',
              fontWeight: active ? 700 : 400,
            }}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}