"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  TrendingDown,
  Scale,
  TrendingUp,
  ChevronDown,
  AlertCircle,
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

export default function ProfileForm() {
  const { setProfile } = useProfileStore();
  const router = useRouter();

  const [form, setForm] = useState({
    gender: "male",
    age: "25",
    weight: "70",
    height: "175",
    activityLevel: 1.55,
    goal: "maintain" as "lose" | "maintain" | "gain",
  });

  const w = Math.abs(Number(form.weight));
  const h = Math.abs(Number(form.height));
  const a = Math.abs(Number(form.age));

  let error: string | null = null;

  let results = {
    calories: 1850,
    protein: 116,
    carbs: 231,
    fat: 51,
  };

  if (!w || !h || !a) {
    error = "Vui lòng nhập đầy đủ thông tin hợp lệ";
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

    results = {
      calories: finalCal,
      protein,
      carbs,
      fat,
    };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      alert("Thông tin không hợp lệ!");
      return;
    }

    const profile: UserProfile = {
      name: "Người dùng",
      age: +form.age,
      weight: +form.weight,
      height: +form.height,
      goal: form.goal,

      macroTarget: {
        calories: results.calories,
        protein: results.protein,
        carbs: results.carbs,
        fat: results.fat,
      },

      currentStreak: 0,
      bestStreak: 0,
    };

    setProfile(profile);

    // Chuyển sang trang tổng quan
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F7FDF9] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-[#1A2F24]">
      <div className="max-w-[480px] sm:max-w-[520px] lg:max-w-[600px] w-full pt-8 lg:pt-10 pb-12 lg:pb-16 px-6 sm:px-10 lg:px-12">

        {/* Header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="flex items-center justify-center gap-1.5 mb-6">

            <span className="material-symbols-outlined filled-icon text-[#084C3A] text-4xl lg:text-5xl">
              local_fire_department
            </span>

            <span className="text-3xl lg:text-4xl font-black text-[#084C3A]">
              CaloMate
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-[#084C3A] leading-tight mb-3">
            Cài đặt tài khoản
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 lg:space-y-7"
        >

          {/* Giới tính */}
          <div>
            <label className="block text-sm lg:text-base font-bold text-[#084C3A] uppercase tracking-wide mb-2">
              Giới tính
            </label>

            <div className="flex bg-[#EAEFEA] p-1 rounded-xl">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    setForm({ ...form, gender: g })
                  }
                  className={`flex-1 py-3.5 lg:py-4 text-sm lg:text-base font-semibold rounded-lg transition-all ${
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

          {/* Tuổi - Cao - Nặng */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5">

            {[
              {
                key: "age",
                label: "TUỔI",
                max: 120,
              },

              {
                key: "height",
                label: "CAO (CM)",
                max: 300,
              },

              {
                key: "weight",
                label: "NẶNG (KG)",
                max: 500,
              },
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-sm lg:text-base font-bold text-[#084C3A] uppercase tracking-wide mb-2">
                  {item.label}
                </label>

                <input
                  type="number"
                  min="1"
                  max={item.max}
                  value={
                    form[item.key as keyof typeof form]
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [item.key]: e.target.value,
                    })
                  }
                  className={`w-full bg-white text-[#1A2F24] text-base lg:text-lg font-semibold px-4 py-3.5 lg:py-4 rounded-xl focus:outline-none border shadow-sm transition-all ${
                    +form[item.key as keyof typeof form] <= 0
                      ? "border-red-500"
                      : "border-transparent focus:border-[#084C3A]"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Activity */}
          <div>
            <label className="block text-sm lg:text-base font-bold text-[#084C3A] uppercase tracking-wide mb-2">
              MỨC ĐỘ HOẠT ĐỘNG
            </label>

            <div className="relative">
              <select
                value={form.activityLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    activityLevel: +e.target.value,
                  })
                }
                className="w-full bg-white text-sm lg:text-base font-semibold py-4 pl-4 pr-10 rounded-xl appearance-none focus:outline-none border border-transparent focus:border-[#084C3A] shadow-sm"
              >
                {activityLevels.map((a) => (
                  <option
                    key={a.value}
                    value={a.value}
                  >
                    {a.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm lg:text-base font-bold text-[#084C3A] uppercase tracking-wide mb-2">
              MỤC TIÊU CỦA BẠN
            </label>

            <div className="grid grid-cols-3 gap-3 lg:gap-4">

              {[
                {
                  v: "lose",
                  l: "Giảm cân",
                  icon: TrendingDown,
                },

                {
                  v: "maintain",
                  l: "Duy trì",
                  icon: Scale,
                },

                {
                  v: "gain",
                  l: "Tăng cân",
                  icon: TrendingUp,
                },
              ].map((g) => (
                <button
                  key={g.v}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      goal: g.v as
                        | "lose"
                        | "maintain"
                        | "gain",
                    })
                  }
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    form.goal === g.v
                      ? "bg-[#E6F4EA] border-[#084C3A] text-[#084C3A]"
                      : "bg-white border-transparent text-[#1A2F24] shadow-sm"
                  }`}
                >
                  <g.icon
                    className={`w-5 h-5 lg:w-6 lg:h-6 mb-2 ${
                      form.goal === g.v
                        ? "text-[#084C3A]"
                        : "text-gray-500"
                    }`}
                  />

                  <span className="text-[11px] lg:text-xs font-bold">
                    {g.l}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 lg:p-4 rounded-lg bg-red-50 text-red-600 text-xs lg:text-sm font-bold">
              <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />

              {error}
            </div>
          )}

          {/* Results */}
          <div className="relative overflow-hidden bg-[#F2F8F4] p-6 lg:p-7 rounded-2xl border border-[#E3EFE8]">

            <span className="material-symbols-outlined absolute -bottom-6 -right-4 text-[130px] lg:text-[160px] text-[#084C3A] opacity-[0.04] pointer-events-none transform -rotate-12">
              energy_savings_leaf
            </span>

            <div className="relative z-10 mb-4">

              <p className="text-[11px] lg:text-xs font-bold text-[#4A6355] uppercase tracking-wide mb-1">
                NHU CẦU DINH DƯỠNG DỰ TÍNH
              </p>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl font-black text-[#084C3A]">
                  {error
                    ? "--"
                    : results.calories.toLocaleString()}
                </span>

                <span className="text-sm lg:text-base font-semibold text-[#084C3A]">
                  kcal / ngày
                </span>
              </div>
            </div>

            <div className="border-t border-[#D5E6DC]/80 pt-5 grid grid-cols-3 gap-2 lg:gap-5 relative z-10">

              {[
                {
                  label: "Tinh bột",
                  val: results.carbs,
                },

                {
                  label: "Đạm",
                  val: results.protein,
                },

                {
                  label: "Chất béo",
                  val: results.fat,
                },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-[12px] lg:text-[13px] font-bold text-[#4A6355] mb-1">
                    {m.label}
                  </p>

                  <p className="text-[22px] lg:text-[26px] font-black text-[#1A2F24] leading-none">
                    {error ? "0" : m.val}g
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!!error}
              className="w-full py-4 lg:py-5 bg-[#084C3A] text-white rounded-xl font-bold text-base lg:text-lg flex items-center justify-center gap-2 hover:bg-[#063B2D] transition-all shadow-md active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Tiếp tục

              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}