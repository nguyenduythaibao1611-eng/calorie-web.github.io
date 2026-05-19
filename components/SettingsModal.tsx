"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  TrendingDown,
  Scale,
  TrendingUp,
  ChevronDown,
  AlertCircle,
  X
} from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import type { UserProfile } from "@/types";

const activityLevels = [
  { value: 1.2, label: "Ít vận động (ngồi nhiều)" },
  { value: 1.375, label: "Vận động nhẹ (1-3 buổi/tuần)" },
  { value: 1.55, label: "Vận động vừa (3-5 buổi/tuần)" },
  { value: 1.725, label: "Vận động nhiều (6-7 buổi/tuần)" },
  { value: 1.9, label: "Vận động rất nhiều" },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { profile, setProfile } = useProfileStore();

  const [form, setForm] = useState({
    gender: "male",
    age: "25",
    weight: "70",
    height: "175",
    activityLevel: 1.55,
    goal: "maintain" as "lose" | "maintain" | "gain",
  });

  // Load existing profile when modal opens
  useEffect(() => {
    if (isOpen && profile) {
      setForm({
        gender: profile.gender || "male",
        age: profile.age ? profile.age.toString() : "25",
        weight: profile.weight ? profile.weight.toString() : "70",
        height: profile.height ? profile.height.toString() : "175",
        activityLevel: profile.activityLevel || 1.55,
        goal: profile.goal || "maintain",
      });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const w = Math.abs(Number(form.weight));
  const h = Math.abs(Number(form.height));
  const a = Math.abs(Number(form.age));

  let error: string | null = null;
  let results = { calories: 1850, protein: 116, carbs: 231, fat: 51 };

  if (!w || !h || !a) {
    error = "Vui lòng nhập đầy đủ thông số lớn hơn 0";
  } else {
    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr = form.gender === "male" ? bmr + 5 : bmr - 161;

    let tdee = bmr * form.activityLevel;

    if (form.goal === "lose") tdee -= 500;
    if (form.goal === "gain") tdee += 500;

    const finalCal = Math.max(Math.round(tdee), 1200);

    const protein = Math.max(Math.round((finalCal * 0.3) / 4), 1);
    const fat = Math.max(Math.round((finalCal * 0.25) / 9), 1);
    const carbs = Math.max(Math.round((finalCal * 0.45) / 4), 1);

    results = { calories: finalCal, protein, carbs, fat };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error || +form.weight <= 0 || +form.height <= 0 || +form.age <= 0) {
      alert("Thông tin nhập vào không hợp lệ!");
      return;
    }

    const newProfile: UserProfile = {
      name: profile?.name || "Người dùng",
      age: +form.age,
      weight: +form.weight,
      height: +form.height,
      gender: form.gender as "male" | "female",
      activityLevel: form.activityLevel,
      goal: form.goal,
      macroTarget: {
        calories: results.calories,
        protein: results.protein,
        carbs: results.carbs,
        fat: results.fat,
      },
      currentStreak: profile?.currentStreak || 0,
      bestStreak: profile?.bestStreak || 0,
    };

    setProfile(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4 sm:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-[#F7FDF9] rounded-3xl shadow-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-gray-500 hover:text-gray-800 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="pt-8 pb-10 px-6 sm:px-10 lg:px-12 font-sans text-[#1A2F24]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className="material-symbols-outlined filled-icon text-[#084C3A] text-4xl">
                settings
              </span>
              <span className="text-3xl font-black text-[#084C3A]">Cài đặt</span>
            </div>
            <p className="text-[#4A6355] text-sm font-medium">
              Cập nhật thông tin để tinh chỉnh mục tiêu của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-7">
            {/* Giới tính */}
            <div>
              <label className="block text-sm font-bold text-[#084C3A] uppercase tracking-wide mb-2">
                Giới tính
              </label>
              <div className="flex bg-[#EAEFEA] p-1 rounded-xl">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`flex-1 py-3.5 text-sm font-semibold rounded-lg transition-all ${
                      form.gender === g
                        ? "bg-white text-[#084C3A] shadow-sm"
                        : "text-gray-500 hover:text-[#084C3A]"
                    }`}
                  >
                    {g === "male" ? "Nam" : "Nữ"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tuổi, Cao, Nặng */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {[
                { key: "age", label: "TUỔI", max: 120 },
                { key: "height", label: "CAO (CM)", max: 300 },
                { key: "weight", label: "NẶNG (KG)", max: 500 },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-bold text-[#084C3A] uppercase tracking-wide mb-2">
                    {item.label}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={item.max}
                    value={form[item.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [item.key]: e.target.value })
                    }
                    className={`w-full bg-white text-[#1A2F24] text-base font-semibold px-4 py-3.5 rounded-xl focus:outline-none border shadow-sm transition-all ${
                      +form[item.key as keyof typeof form] <= 0
                        ? "border-red-500"
                        : "border-transparent focus:border-[#084C3A]"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Mức độ hoạt động */}
            <div>
              <label className="block text-sm font-bold text-[#084C3A] uppercase tracking-wide mb-2">
                MỨC ĐỘ HOẠT ĐỘNG
              </label>
              <div className="relative">
                <select
                  value={form.activityLevel}
                  onChange={(e) =>
                    setForm({ ...form, activityLevel: +e.target.value })
                  }
                  className="w-full bg-white text-sm font-semibold py-4 pl-4 pr-10 rounded-xl appearance-none focus:outline-none border border-transparent focus:border-[#084C3A] shadow-sm"
                >
                  {activityLevels.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Mục tiêu */}
            <div>
              <label className="block text-sm font-bold text-[#084C3A] uppercase tracking-wide mb-2">
                MỤC TIÊU CỦA BẠN
              </label>
              <div className="grid grid-cols-3 gap-3 lg:gap-4">
                {[
                  { v: "lose", l: "Giảm cân", icon: TrendingDown },
                  { v: "maintain", l: "Duy trì", icon: Scale },
                  { v: "gain", l: "Tăng cân", icon: TrendingUp },
                ].map((g) => (
                  <button
                    key={g.v}
                    type="button"
                    onClick={() =>
                      setForm({ ...form, goal: g.v as "lose" | "maintain" | "gain" })
                    }
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      form.goal === g.v
                        ? "bg-[#E6F4EA] border-[#084C3A] text-[#084C3A]"
                        : "bg-white border-transparent text-[#1A2F24] shadow-sm"
                    }`}
                  >
                    <g.icon
                      className={`w-5 h-5 mb-2 ${
                        form.goal === g.v ? "text-[#084C3A]" : "text-gray-500"
                      }`}
                    />
                    <span className="text-[11px] font-bold">{g.l}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!!error}
                className="w-full py-4 bg-[#084C3A] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#063B2D] transition-all shadow-md active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Lưu cài đặt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
