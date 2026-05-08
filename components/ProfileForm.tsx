"use client";

import { useState } from "react";
import { TrendingDown, Scale, TrendingUp, ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";

export default function ProfileForm() {
  const [gender, setGender] = useState<"nam" | "nữ">("nam");
  const [age, setAge] = useState<string>("25");
  const [height, setHeight] = useState<string>("175");
  const [weight, setWeight] = useState<string>("70");
  const [activity, setActivity] = useState<string>("vừa");
  const [goal, setGoal] = useState<"giảm" | "duy_trì" | "tăng">("giảm");
  
  // State mới để quản lý thông báo lưu thành công
  const [isSaved, setIsSaved] = useState(false);

  const isFormValid = age !== "" && height !== "" && weight !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Vui lòng điền đầy đủ Tuổi, Chiều cao và Cân nặng!");
      return;
    }
    
    // Ghi log dữ liệu ra (Sau này sẽ gọi hàm Zustand từ Task 12 của Triều ở đây)
    console.log("Dữ liệu form:", { gender, age, height, weight, activity, goal });
    
    // Hiển thị thông báo thành công
    setIsSaved(true);
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4FAF7] flex items-center justify-center p-4 font-sans text-[#1A2F24]">
      <div className="max-w-md w-full bg-[#F4FAF7] rounded-3xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-[#084C3A]">🔥 CaloMate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#084C3A] mb-2">
            Hãy bắt đầu hành trình của bạn
          </h1>
          <p className="text-sm text-gray-600">
            Chúng tôi sẽ tính lượng calo phù hợp với cơ thể bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Giới tính */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Giới tính</label>
            <div className="flex bg-gray-200/60 p-1 rounded-2xl">
              <button type="button" onClick={() => setGender("nam")} className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${gender === "nam" ? "bg-white text-[#084C3A] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Nam</button>
              <button type="button" onClick={() => setGender("nữ")} className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${gender === "nữ" ? "bg-white text-[#084C3A] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Nữ</button>
            </div>
          </div>

          {/* Tuổi, Cao, Nặng */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tuổi</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-white text-center text-lg font-bold py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#084C3A]" placeholder="25" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cao (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-white text-center text-lg font-bold py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#084C3A]" placeholder="175" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nặng (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-white text-center text-lg font-bold py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#084C3A]" placeholder="70" />
            </div>
          </div>

          {/* Mức độ hoạt động */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mức độ hoạt động</label>
            <div className="relative">
              <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full bg-white text-[#1A2F24] text-sm font-semibold py-4 pl-4 pr-10 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#084C3A]">
                <option value="ít">Ít vận động</option>
                <option value="vừa">Vận động vừa (3-5 buổi/tuần)</option>
                <option value="nhiều">Vận động nhiều</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Mục tiêu */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mục tiêu của bạn</label>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => setGoal("giảm")} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${goal === "giảm" ? "bg-[#E6F4EA] border-[#084C3A] text-[#084C3A]" : "bg-white border-transparent text-gray-500 hover:border-gray-200"}`}>
                <TrendingDown className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Giảm cân</span>
              </button>
              <button type="button" onClick={() => setGoal("duy_trì")} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${goal === "duy_trì" ? "bg-[#E6F4EA] border-[#084C3A] text-[#084C3A]" : "bg-white border-transparent text-gray-500 hover:border-gray-200"}`}>
                <Scale className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Duy trì</span>
              </button>
              <button type="button" onClick={() => setGoal("tăng")} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${goal === "tăng" ? "bg-[#E6F4EA] border-[#084C3A] text-[#084C3A]" : "bg-white border-transparent text-gray-500 hover:border-gray-200"}`}>
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">Tăng cân</span>
              </button>
            </div>
          </div>

          {/* Nhu cầu dinh dưỡng */}
          <div className="bg-[#EAF3EE] p-5 rounded-2xl border border-[#D5E6DC]">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nhu cầu dinh dưỡng dự tính</p>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-2xl font-extrabold text-[#084C3A]">1.850</span>
              <span className="text-sm font-semibold text-[#084C3A] mb-1">kcal / ngày</span>
            </div>
            <div className="border-t border-[#D5E6DC] pt-4 grid grid-cols-3 gap-2">
              <div><p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Tinh bột</p><p className="text-sm font-bold text-[#1A2F24]">231g</p></div>
              <div><p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Đạm</p><p className="text-sm font-bold text-[#1A2F24]">116g</p></div>
              <div><p className="text-[10px] uppercase text-gray-500 font-semibold mb-1">Chất béo</p><p className="text-sm font-bold text-[#1A2F24]">51g</p></div>
            </div>
          </div>

          {/* Nút Submit và Thông báo */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isFormValid ? "bg-[#084C3A] text-white shadow-lg hover:bg-[#063B2D] hover:shadow-xl" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Bắt đầu ngay <ArrowRight className="w-5 h-5" />
            </button>
            
            {/* Hiển thị thông báo khi lưu thành công */}
            {isSaved && (
              <div className="flex items-center justify-center gap-2 text-[#084C3A] font-bold animate-pulse">
                <CheckCircle2 className="w-5 h-5" />
                <span>Lưu thông tin thành công!</span>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}