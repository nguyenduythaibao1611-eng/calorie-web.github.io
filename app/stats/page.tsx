"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";
import { getLogs } from "@/lib/storage";
import { toLocalDateStr } from "@/lib/calc";
import type { DailyLog } from "@/types";
import { AppShell } from "@/components/nav/AppShell";

// ─── Lazy components ────────────────────────────────────────────────────────
const WeeklyChart = dynamic(() => import("@/components/stats/WeeklyChart"), {
  loading: () => <div className="h-[280px] animate-pulse rounded-3xl border border-emerald-600/10 bg-white/60" />,
  ssr: false,
});
const StatCard = dynamic(() => import("@/components/stats/StatCard"), {
  loading: () => <div className="h-24 animate-pulse rounded-3xl border border-emerald-600/10 bg-white/60" />,
  ssr: false,
});
const MacroSection = dynamic(() => import("@/components/stats/MacroSection"), {
  loading: () => <div className="h-64 animate-pulse rounded-3xl border border-emerald-600/10 bg-white/60" />,
  ssr: false,
});

type TabMode = "week" | "month" | "custom";

interface DateRange {
  start: string;
  end: string;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return toLocalDateStr(d);
}

function getWeekRange(offset: number): DateRange {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7) + offset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: toLocalDateStr(monday), end: toLocalDateStr(sunday) };
}

function getMonthRange(offset: number): DateRange {
  const today = new Date();
  const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const start = toLocalDateStr(d);
  const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start, end: toLocalDateStr(endD) };
}

function formatRangeLabel(range: DateRange, mode: TabMode): string {
  const start = new Date(range.start);
  const end = new Date(range.end);
  const viDate = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString("vi-VN", opts);

  if (mode === "week") {
    return `${viDate(start, { day: "numeric", month: "long" })} – ${viDate(end, { day: "numeric", month: "long", year: "numeric" })}`;
  }
  if (mode === "month") {
    return viDate(start, { month: "long", year: "numeric" });
  }
  return `${viDate(start, { day: "numeric", month: "numeric", year: "numeric" })} – ${viDate(end, { day: "numeric", month: "numeric", year: "numeric" })}`;
}

function formatShortRangeLabel(range: DateRange, mode: TabMode): string {
  const start = new Date(range.start);
  const end = new Date(range.end);
  const viDate = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString("vi-VN", opts);

  if (mode === "week") {
    return `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  }
  if (mode === "month") {
    return viDate(start, { month: "numeric", year: "numeric" });
  }
  return `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}`;
}

function getDayLabel(dateStr: string): string {
  return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][new Date(dateStr).getDay()];
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
interface MiniCalendarProps {
  selecting: "start" | "end";
  tempStart: string | null;
  tempEnd: string | null;
  onSelect: (date: string) => void;
  hoverDate: string | null;
  onHover: (date: string | null) => void;
  viewMonth: { year: number; month: number };
  onChangeMonth: (delta: number) => void;
  today: string;
}

function MiniCalendar({
  selecting, tempStart, tempEnd, onSelect, hoverDate, onHover, viewMonth, onChangeMonth, today,
}: MiniCalendarProps) {
  const { year, month } = viewMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;

  const cells: (string | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return toLocalDateStr(d);
    }),
  ];

  const monthName = new Date(year, month, 1).toLocaleDateString("vi-VN", {
    month: "long", year: "numeric",
  });

  function isInRange(date: string): boolean {
    const s = tempStart;
    const e = tempEnd ?? hoverDate;
    if (!s || !e) return false;
    const [lo, hi] = s <= e ? [s, e] : [e, s];
    return date > lo && date < hi;
  }

  function isRangeEdge(date: string): "start" | "end" | "both" | null {
    const s = tempStart;
    const e = tempEnd ?? hoverDate;
    if (!s) return null;
    if (!e || s === e) return date === s ? "both" : null;
    const [lo, hi] = s <= e ? [s, e] : [e, s];
    if (date === lo && date === hi) return "both";
    if (date === lo) return "start";
    if (date === hi) return "end";
    return null;
  }

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => onChangeMonth(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-emerald-600/10"
        >
          <span className="material-symbols-outlined text-base text-slate-500">chevron_left</span>
        </button>
        <span className="text-sm font-semibold text-slate-800 capitalize">{monthName}</span>
        <button
          onClick={() => onChangeMonth(1)}
          disabled={year > new Date().getFullYear() || (year === new Date().getFullYear() && month >= new Date().getMonth())}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-emerald-600/10 disabled:pointer-events-none disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-base text-slate-500">chevron_right</span>
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-bold text-slate-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;
          const isFuture = date > today;
          const edge = isRangeEdge(date);
          const inRange = isInRange(date);
          const isToday = date === today;

          return (
            <div
              key={date}
              className={`
                relative flex h-8 cursor-pointer items-center justify-center text-xs font-medium
                transition-colors duration-100
                ${isFuture ? "pointer-events-none opacity-25" : ""}
                ${inRange ? "bg-emerald-600/15" : ""}
                ${edge === "start" ? "rounded-l-full bg-emerald-600/15" : ""}
                ${edge === "end" ? "rounded-r-full bg-emerald-600/15" : ""}
                ${edge === "both" ? "rounded-full" : ""}
              `}
              onClick={() => !isFuture && onSelect(date)}
              onMouseEnter={() => !isFuture && onHover(date)}
              onMouseLeave={() => onHover(null)}
            >
              <span
                className={`
                  relative z-10 flex h-7 w-7 items-center justify-center rounded-full
                  ${edge ? "bg-emerald-600 font-bold text-white" : ""}
                  ${isToday && !edge ? "border-2 border-emerald-600 font-bold text-emerald-600" : ""}
                  ${!edge && !isToday ? "text-slate-800 hover:bg-emerald-600/10" : ""}
                `}
              >
                {new Date(date).getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Custom Range Picker ───────────────────────────────────────────────────────
interface CustomPickerProps {
  current: DateRange;
  onApply: (range: DateRange) => void;
  onCancel: () => void;
  today: string;
}

function CustomPicker({ current, onApply, onCancel, today }: CustomPickerProps) {
  const [tempStart, setTempStart] = useState<string | null>(current.start);
  const [tempEnd, setTempEnd] = useState<string | null>(current.end);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const initMonth = new Date(current.end);
  const [viewMonth, setViewMonth] = useState({ year: initMonth.getFullYear(), month: initMonth.getMonth() });

  const presets = [
    { label: "7 ngày qua", days: 7 },
    { label: "14 ngày qua", days: 14 },
    { label: "30 ngày qua", days: 30 },
  ];

  function applyPreset(days: number) {
    const end = today;
    const start = addDays(today, -(days - 1));
    setTempStart(start);
    setTempEnd(end);
    setSelecting("start");
  }

  function handleDateSelect(date: string) {
    if (selecting === "start") {
      setTempStart(date);
      setTempEnd(null);
      setSelecting("end");
    } else {
      if (tempStart && date < tempStart) {
        setTempStart(date);
        setTempEnd(tempStart);
      } else {
        setTempEnd(date);
      }
      setSelecting("start");
    }
  }

  function handleChangeMonth(delta: number) {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const canApply = tempStart && tempEnd;
  const viDate = (s: string) =>
    new Date(s).toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full right-0 z-50 mt-2 w-[340px] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl space-y-4 sm:w-[380px]"
    >
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Chọn nhanh</p>
        <div className="flex gap-2">
          {presets.map((p) => (
            <button
              key={p.days}
              onClick={() => applyPreset(p.days)}
              className="flex-1 rounded-full border border-emerald-600/30 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setSelecting("start")}
          className={`flex-1 rounded-2xl border px-3 py-2 text-center transition-colors ${
            selecting === "start"
              ? "border-emerald-600 bg-emerald-50 text-emerald-600 font-semibold"
              : "border-slate-200 text-slate-500"
          }`}
        >
          {tempStart ? viDate(tempStart) : "Từ ngày..."}
        </button>
        <span className="material-symbols-outlined text-base text-slate-400">arrow_forward</span>
        <button
          onClick={() => setSelecting("end")}
          className={`flex-1 rounded-2xl border px-3 py-2 text-center transition-colors ${
            selecting === "end"
              ? "border-emerald-600 bg-emerald-50 text-emerald-600 font-semibold"
              : "border-slate-200 text-slate-500"
          }`}
        >
          {tempEnd ? viDate(tempEnd) : "Đến ngày..."}
        </button>
      </div>

      <MiniCalendar
        selecting={selecting}
        tempStart={tempStart}
        tempEnd={tempEnd}
        onSelect={handleDateSelect}
        hoverDate={hoverDate}
        onHover={setHoverDate}
        viewMonth={viewMonth}
        onChangeMonth={handleChangeMonth}
        today={today}
      />

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50"
        >
          Huỷ
        </button>
        <button
          disabled={!canApply}
          onClick={() => canApply && onApply({ start: tempStart!, end: tempEnd! })}
          className="flex-1 rounded-2xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-40"
        >
          Áp dụng
        </button>
      </div>
    </motion.div>
  );
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let cur = start;
  while (cur <= end) {
    dates.push(cur);
    cur = addDays(cur, 1);
  }
  return dates;
}

function calcAvgMacros(logs: DailyLog[]) {
  if (logs.length === 0) return { protein: 0, carbs: 0, fat: 0 };
  const total = logs.reduce(
    (acc, log) => {
      log.meals.forEach((m) =>
        m.ingredients.forEach((i) => {
          const r = (i.amount ?? 100) / 100;
          acc.protein += i.protein * r;
          acc.carbs += i.carbs * r;
          acc.fat += i.fat * r;
        })
      );
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );
  const count = logs.filter((l) => l.totalCalories > 0).length || 1;
  return {
    protein: Math.round(total.protein / count),
    carbs: Math.round(total.carbs / count),
    fat: Math.round(total.fat / count),
  };
}

// ─── Animation variants ───────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const { profile, loadProfile, syncStreak } = useProfileStore();

  const today = useMemo(() => toLocalDateStr(new Date()), []);

  const [activeTab, setActiveTab] = useState<TabMode>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const [customRange, setCustomRange] = useState<DateRange>({
    start: addDays(today, -6),
    end: today,
  });
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const range = useMemo((): DateRange => {
    if (activeTab === "week") return getWeekRange(weekOffset);
    if (activeTab === "month") return getMonthRange(monthOffset);
    return customRange;
  }, [activeTab, weekOffset, monthOffset, customRange]);

  const isCurrentPeriod = useMemo(() => {
    if (activeTab === "week") return weekOffset === 0;
    if (activeTab === "month") return monthOffset === 0;
    return range.end >= today;
  }, [activeTab, weekOffset, monthOffset, range, today]);

  useEffect(() => {
    loadProfile();
    syncStreak();
    setMounted(true);
  }, [loadProfile, syncStreak]);

  useEffect(() => {
    if (!mounted) return;
    const loaded = getLogs(range.start, range.end);
    setLogs(loaded);
  }, [range, mounted]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    if (showPicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  const target = profile?.macroTarget?.calories ?? 2000;
  const dates = useMemo(() => getDatesInRange(range.start, range.end), [range]);

  const daysLogged = useMemo(() => logs.filter((l) => l.totalCalories > 0).length, [logs]);
  const avgCalories = useMemo(
    () => daysLogged > 0 ? Math.round(logs.reduce((s, l) => s + l.totalCalories, 0) / daysLogged) : 0,
    [logs, daysLogged]
  );
  const daysMetTarget = useMemo(
    () => logs.filter((l) => l.totalCalories >= target * 0.8).length,
    [logs, target]
  );
  const totalDeficit = useMemo(
    () => logs.filter((l) => l.totalCalories > 0).reduce((s, l) => s + (l.totalCalories - target), 0),
    [logs, target]
  );
  const currentStreak = profile?.currentStreak ?? 0;
  const avgMacros = useMemo(() => calcAvgMacros(logs), [logs]);
  const macroKcal = useMemo(() => {
    const protein = avgMacros.protein * 4;
    const carbs = avgMacros.carbs * 4;
    const fat = avgMacros.fat * 9;
    const total = protein + carbs + fat || 1;
    return { protein, carbs, fat, total };
  }, [avgMacros]);

  const macroStats = useMemo(() => [
    { label: "CARBS", percent: Math.round((macroKcal.carbs / macroKcal.total) * 100), kcal: macroKcal.carbs, color: "primary" as const },
    { label: "PROTEIN", percent: Math.round((macroKcal.protein / macroKcal.total) * 100), kcal: macroKcal.protein, color: "primary-container" as const },
    { label: "FAT", percent: Math.round((macroKcal.fat / macroKcal.total) * 100), kcal: macroKcal.fat, color: "outline-variant" as const },
  ], [macroKcal]);

  const weeklyData = useMemo(() => {
    function getDateNum(dateStr: string): string {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    }
    return dates.map((date) => {
      const log = logs.find((l) => l.date === date);
      return {
        date: getDayLabel(date),
        dateNum: getDateNum(date),
        calories: log?.totalCalories ?? 0,
        target,
        isToday: date === today,
      };
    });
  }, [dates, logs, target, today]);

  const rangeLabel = useMemo(() => formatRangeLabel(range, activeTab), [range, activeTab]);
  const shortRangeLabel = useMemo(() => formatShortRangeLabel(range, activeTab), [range, activeTab]);

  function handleTabChange(tab: TabMode) {
    setActiveTab(tab);
    setShowPicker(false);
  }

  if (!mounted) return null;

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <main className="mx-auto max-w-[1100px] px-4 pt-16 pb-24 space-y-6 sm:px-6">

          {/* HEADER SECTION */}
          <motion.section
            custom={0} 
            variants={cardVariants} 
            initial="hidden" 
            animate="visible"
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-5 pt-6"
          >
            {/* Tiêu đề góc trái - text-4xl khổng lồ, xanh đậm nét */}
            <div className="flex items-center gap-3.5">
              <span className="material-symbols-outlined rounded-2xl bg-emerald-50 p-2.5 text-2xl sm:text-3xl text-emerald-600 shadow-sm shrink-0">
                insights
              </span>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-emerald-900 sm:text-3xl lg:text-4xl">
                  Thống kê báo cáo
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 hidden sm:block font-medium">
                  Theo dõi xu hướng năng lượng và cân bằng dinh dưỡng của bạn
                </p>
              </div>
            </div>

            {/* Các bộ lọc cố định vị trí góc phải */}
            <div className="flex items-center justify-start sm:justify-end gap-3 flex-wrap">
              
              {/* Tab switcher */}
              <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 shadow-inner w-full sm:w-auto justify-between sm:justify-start">
                {(["week", "month", "custom"] as TabMode[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`
                      py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-center
                      w-[31%] sm:w-24 shrink-0
                      ${activeTab === tab
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                      }
                    `}
                  >
                    {tab === "week" ? "Tuần" : tab === "month" ? "Tháng" : "Tuỳ chọn"}
                  </button>
                ))}
              </div>

              {/* Date Navigator & Custom Picker */}
              <div className="relative flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end" ref={pickerRef}>
                <button
                  onClick={() => {
                    if (activeTab === "week") setWeekOffset((o) => o - 1);
                    else setMonthOffset((o) => o - 1);
                  }}
                  disabled={activeTab === "custom"}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-0 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-base text-slate-600 sm:text-lg">chevron_left</span>
                </button>

                <button
                  onClick={() => activeTab === "custom" && setShowPicker((p) => !p)}
                  className={`
                    flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold shadow-sm transition-colors text-center shrink-0
                    w-[calc(100%-88px)] sm:w-60 md:w-64 h-9
                    ${activeTab === "custom"
                      ? "bg-white border border-emerald-600/40 text-emerald-600 hover:bg-emerald-50/50"
                      : "bg-white border border-slate-200 text-slate-800 cursor-default"
                    }
                  `}
                >
                  {activeTab === "custom" && (
                    <span className="material-symbols-outlined text-base">calendar_month</span>
                  )}
                  <span className="hidden md:inline truncate">{rangeLabel}</span>
                  <span className="inline md:hidden truncate">{shortRangeLabel}</span>
                  
                  {activeTab === "custom" && (
                    <span className={`material-symbols-outlined text-base transition-transform duration-200 ${showPicker ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  )}
                </button>

                <button
                  disabled={isCurrentPeriod || activeTab === "custom"}
                  onClick={() => {
                    if (activeTab === "week") setWeekOffset((o) => o - 1);
                    else setMonthOffset((o) => o + 1);
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-base text-slate-600 sm:text-lg">chevron_right</span>
                </button>

                {/* TRẢ LẠI THÀNH TRƯỢT LỊCH HOẠT ĐỘNG CHUẨN XÁC Ở ĐÂY */}
                <AnimatePresence>
                  {showPicker && (
                    <CustomPicker
                      current={customRange}
                      today={today}
                      onApply={(r) => { setCustomRange(r); setShowPicker(false); }}
                      onCancel={() => setShowPicker(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* Content grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 items-start">
            <div className="space-y-4 sm:space-y-5 lg:col-span-7">
              <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                <WeeklyChart data={weeklyData} />
              </motion.div>

              <section className="grid grid-cols-2 gap-4 sm:gap-5">
                {[
                  { label: "TB MỖI NGÀY", value: avgCalories.toLocaleString(), unit: "kcal" },
                  { label: "ĐẠT MỤC TIÊU", value: `${daysMetTarget}/${dates.length}`, unit: "ngày" },
                  {
                    label: "THÂM HỤT",
                    value: totalDeficit >= 0 ? `+${totalDeficit.toLocaleString()}` : totalDeficit.toLocaleString(),
                    unit: "kcal",
                    isNegative: totalDeficit < 0,
                  },
                  { label: "CHUỖI STREAK", value: currentStreak, unit: "ngày", isStreak: true },
                ].map((card, index) => (
                  <motion.div key={card.label} custom={index + 2} variants={cardVariants} initial="hidden" animate="visible">
                    <StatCard {...card} />
                  </motion.div>
                ))}
              </section>
            </div>

            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="h-full lg:col-span-5">
              <MacroSection macros={macroStats} />
            </motion.div>
          </div>

          {/* Empty state */}
          {logs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="rounded-3xl border border-dashed border-slate-200 bg-white py-10 text-center shadow-sm"
            >
              <span className="material-symbols-outlined text-4xl text-slate-400">bar_chart</span>
              <p className="mt-2 text-sm text-slate-500">Chưa có dữ liệu trong khoảng này</p>
              <p className="mt-1 text-xs text-slate-400">Hãy ghi nhật ký bữa ăn đầu tiên!</p>
            </motion.div>
          )}
        </main>
      </div>
    </AppShell>
  );
}