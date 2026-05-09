"use client";

import React from "react";
import { 
  Flame, Beef, Wheat, Droplet, 
  TrendingUp, CalendarDays, Award
} from "lucide-react";

// Dữ liệu giả lập 7 ngày để render UI
const weeklyData = [
  { day: "T2", cal: 1800, goal: 2000 },
  { day: "T3", cal: 1950, goal: 2000 },
  { day: "T4", cal: 1700, goal: 2000 },
  { day: "T5", cal: 2100, goal: 2000 },
  { day: "T6", cal: 1850, goal: 2000 },
  { day: "T7", cal: 2200, goal: 2000 }, // Vượt mục tiêu
  { day: "CN", cal: 1900, goal: 2000 },
];

export default function StatsPage() {
  // Tìm mức calo cao nhất để chia tỷ lệ chiều cao cột cho chuẩn
  const maxCal = Math.max(...weeklyData.map(d => d.cal), 2000);

  return (
    <div className="min-h-screen bg-[#F4FAF7] flex items-center justify-center p-4 font-sans text-[#1A2F24]">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E0E7E3]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#084C3A]">Thống Kê</h1>
            <p className="text-sm text-gray-500">Hoạt động 7 ngày qua của bạn</p>
          </div>
          <div className="w-12 h-12 bg-[#EAF3EE] rounded-2xl flex items-center justify-center text-[#084C3A]">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* 1. Streak Display (Chuỗi ngày) */}
        <div className="bg-gradient-to-r from-[#084C3A] to-[#0A634B] rounded-2xl p-5 mb-6 text-white shadow-lg shadow-[#084C3A]/20 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Chuỗi nỗ lực</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold">12</span>
              <span className="text-sm font-medium mb-1">ngày liên tiếp</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Flame className="w-8 h-8 text-orange-400 drop-shadow-md" fill="currentColor" />
          </div>
        </div>

        {/* 2. Bar chart 7 days */}
        <div className="bg-[#F8FBF9] rounded-2xl p-5 border border-[#E0E7E3] mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-[#1A2F24] flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#084C3A]" />
              Lượng Calo Tuần Này
            </h2>
            <span className="text-xs font-bold text-[#084C3A] bg-[#EAF3EE] px-2 py-1 rounded-lg">Trung bình: 1914 kcal</span>
          </div>

          {/* Biểu đồ cột */}
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyData.map((data, index) => {
              // Tính % chiều cao so với maxCal
              const heightPercent = (data.cal / maxCal) * 100;
              const isOver = data.cal > data.goal;

              return (
                <div key={index} className="flex flex-col items-center flex-1 gap-2 group">
                  {/* Tooltip ẩn hiện khi hover */}
                  <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.cal}
                  </span>
                  
                  {/* Cột Bar */}
                  <div className="w-full relative flex justify-center items-end h-full bg-gray-100 rounded-t-md overflow-hidden">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-500 ${isOver ? 'bg-orange-400' : 'bg-[#084C3A]'}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  
                  {/* Label Ngày */}
                  <span className={`text-xs font-bold ${data.day === "CN" ? 'text-red-500' : 'text-gray-400'}`}>
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Macro average */}
        <div>
          <h2 className="text-sm font-bold text-[#1A2F24] flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-[#084C3A]" />
            Trung Bình Macro (7 ngày)
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Cột Carbs */}
            <div className="bg-white border border-[#E0E7E3] rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-2 text-blue-500">
                <Wheat className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Carbs</p>
              <p className="text-lg font-extrabold text-[#1A2F24]">210<span className="text-xs font-normal text-gray-500">g</span></p>
            </div>

            {/* Cột Protein */}
            <div className="bg-white border border-[#E0E7E3] rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center mb-2 text-red-500">
                <Beef className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Protein</p>
              <p className="text-lg font-extrabold text-[#1A2F24]">125<span className="text-xs font-normal text-gray-500">g</span></p>
            </div>

            {/* Cột Fat */}
            <div className="bg-white border border-[#E0E7E3] rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center mb-2 text-yellow-500">
                <Droplet className="w-4 h-4" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fat</p>
              <p className="text-lg font-extrabold text-[#1A2F24]">55<span className="text-xs font-normal text-gray-500">g</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}