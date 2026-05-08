"use client";

import { useState } from "react";
import { 
  TrendingDown, Scale, TrendingUp, ArrowRight, 
  ChevronDown, CheckCircle2, User, AlertCircle 
} from "lucide-react";

const activityLevels = [
  { value: 1.2, label: 'Ít vận động (ngồi nhiều)' },
  { value: 1.375, label: 'Nhẹ (1-3 ngày/tuần)' },
  { value: 1.55, label: 'Vừa (3-5 ngày/tuần)' },
  { value: 1.725, label: 'Nhiều (6-7 ngày/tuần)' },
  { value: 1.9, label: 'Rất nhiều (2 lần/ngày)' },
];

export default function ProfileForm() {
  // Tạm khóa Zustand lại chờ Triều merge code Task 12
  // const { setProfile } = useProfileStore();
  
  const [form, setForm] = useState({
    name: "",
    gender: "male",
    age: "25",
    weight: "70",
    height: "175",
    activityLevel: 1.55,
    goal: "lose",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên của bạn";
    if (!form.age || +form.age < 10 || +form.age > 100) e.age = "Tuổi phải từ 10-100 nha";
    if (!form.weight || +form.weight < 30 || +form.weight > 300) e.weight = "Cân nặng từ 30-300kg thôi";
    if (!form.height || +form.height < 100 || +form.height > 250) e.height = "Chiều cao từ 100-250cm nhé";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    
    const profile = {
      name: form.name,
      gender: form.gender,
      age: +form.age,
      weight: +form.weight,
      height: +form.height,
      activityLevel: form.activityLevel,
      goal: form.goal,
      dailyCalTarget: 1850,
      macroTarget: { protein: 116, carb: 231, fat: 51 },
    };

    console.log("Dữ liệu đã sẵn sàng để gửi cho Zustand:", profile);
    // setProfile(profile); // Khi nào merge code với Triều thì mở dòng này ra
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4FAF7] flex items-center justify-center p-4 font-sans text-[#1A2F24]">
      <div className="max-w-md w-full bg-[#F4FAF7] rounded-3xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 text-[#084C3A]">
            <span className="text-2xl font-bold">🔥 CaloMate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#084C3A] mb-2">Hồ Sơ Cá Nhân</h1>
          <p className="text-sm text-gray-600">Thiết lập mục tiêu để CaloMate đồng hành cùng bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tên */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tên của bạn</label>
            <div className="relative">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className={`w-full bg-white px-4 py-3 rounded-2xl focus:outline-none border-2 transition-all ${errors.name ? 'border-red-400' : 'border-transparent focus:border-[#084C3A]'}`}
                placeholder="Nhập tên..."
              />
              <User className="absolute right-4 top-3.5 w-5 h-5 text-gray-300" />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name}</p>}
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Giới tính</label>
            <div className="flex bg-gray-200/60 p-1 rounded-2xl">
              {['male', 'female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({...form, gender: g})}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${form.gender === g ? "bg-white text-[#084C3A] shadow-sm" : "text-gray-500"}`}
                >
                  {g === 'male' ? 'Nam' : 'Nữ'}
                </button>
              ))}
            </div>
          </div>

          {/* Tuổi, Cao, Nặng */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'age', label: 'Tuổi', unit: '' },
              { key: 'height', label: 'Cao', unit: 'cm' },
              { key: 'weight', label: 'Nặng', unit: 'kg' },
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 text-center">{item.label} {item.unit && `(${item.unit})`}</label>
                <input
                  type="number"
                  value={form[item.key as keyof typeof form]}
                  onChange={(e) => setForm({...form, [item.key]: e.target.value})}
                  className={`w-full bg-white text-center text-lg font-bold py-3 rounded-2xl focus:outline-none border-2 transition-all ${errors[item.key] ? 'border-red-400' : 'border-transparent focus:border-[#084C3A]'}`}
                />
              </div>
            ))}
          </div>

          {/* Mức độ hoạt động */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Mức độ vận động</label>
            <div className="relative">
              <select
                value={form.activityLevel}
                onChange={(e) => setForm({...form, activityLevel: +e.target.value})}
                className="w-full bg-white text-sm font-semibold py-4 pl-4 pr-10 rounded-2xl appearance-none focus:outline-none border-2 border-transparent focus:border-[#084C3A]"
              >
                {activityLevels.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Mục tiêu */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Mục tiêu</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 'lose', l: 'Giảm cân', icon: TrendingDown },
                { v: 'maintain', l: 'Duy trì', icon: Scale },
                { v: 'gain', l: 'Tăng cân', icon: TrendingUp },
              ].map((g) => (
                <button
                  key={g.v}
                  type="button"
                  onClick={() => setForm({...form, goal: g.v})}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${form.goal === g.v ? "bg-[#E6F4EA] border-[#084C3A] text-[#084C3A]" : "bg-white border-transparent text-gray-400"}`}
                >
                  <g.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">{g.l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-[#EAF3EE] p-4 rounded-2xl border border-[#D5E6DC]">
            <div className="flex items-end gap-1 mb-3">
              <span className="text-2xl font-extrabold text-[#084C3A]">1.850</span>
              <span className="text-xs font-semibold text-[#084C3A] mb-1">kcal / ngày</span>
            </div>
            <div className="border-t border-[#D5E6DC] pt-3 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-[9px] uppercase text-gray-400 font-bold">Carbs</p><p className="text-sm font-bold text-[#1A2F24]">231g</p></div>
              <div><p className="text-[9px] uppercase text-gray-400 font-bold">Protein</p><p className="text-sm font-bold text-[#1A2F24]">116g</p></div>
              <div><p className="text-[9px] uppercase text-gray-400 font-bold">Fat</p><p className="text-sm font-bold text-[#1A2F24]">51g</p></div>
            </div>
          </div>

          {/* Nút Submit & Success */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-[#084C3A] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#063B2D] shadow-lg transition-all active:scale-95"
            >
              Lưu hồ sơ ngay <ArrowRight className="w-5 h-5" />
            </button>
            
            {isSaved && (
              <div className="flex items-center justify-center gap-2 text-[#084C3A] font-bold mt-4 animate-bounce">
                <CheckCircle2 className="w-5 h-5" />
                <span>Lưu thành công!</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
