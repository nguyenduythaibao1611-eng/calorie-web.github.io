import { UserProfile, MacroTarget, DailyLog } from "@/types";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

/** Activity multipliers (sedentary → very active) */
const ACTIVITY_MULTIPLIER = {
  sedentary: 1.2, // Ít vận động, ngồi nhiều
  light: 1.375, // Tập nhẹ 1-3 ngày/tuần
  moderate: 1.55, // Tập vừa 3-5 ngày/tuần
  active: 1.725, // Tập nặng 6-7 ngày/tuần
  veryActive: 1.9, // Vận động viên / lao động nặng
} as const;

export type ActivityLevel = keyof typeof ACTIVITY_MULTIPLIER;

/** Calorie adjustment theo goal */
const GOAL_ADJUSTMENT: Record<UserProfile["goal"], number> = {
  lose: -500, // Giảm ~0.5kg/tuần
  maintain: 0,
  gain: +300, // Tăng cơ, tăng cân chậm
};

/** Macro ratio theo goal (protein%, carbs%, fat%) */
const MACRO_RATIO: Record<
  UserProfile["goal"],
  { protein: number; carbs: number; fat: number }
> = {
  lose: { protein: 0.35, carbs: 0.35, fat: 0.3 },
  maintain: { protein: 0.25, carbs: 0.5, fat: 0.25 },
  gain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
};

/** Calories per gram */
const CAL_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Format ngày theo local timezone thành chuỗi YYYY-MM-DD.
 *
 * KHÔNG dùng toISOString() vì nó trả về UTC — với người dùng UTC+7 (Việt Nam),
 * sau 17:00 UTC (tức 00:00 ngày hôm sau giờ VN), toISOString() sẽ trả về
 * ngày hôm sau thay vì ngày hiện tại, gây lệch streak 1 ngày.
 *
 * @param date - Đối tượng Date cần format (mặc định là hiện tại)
 * @returns Chuỗi ngày theo local timezone, vd: "2026-05-17"
 */
export function toLocalDateStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Tính BMR theo công thức Mifflin-St Jeor.
 *
 * Nam  : BMR = 10 × weight + 6.25 × height − 5 × age + 5
 * Nữ   : BMR = 10 × weight + 6.25 × height − 5 × age − 161
 *
 * @param weight  Cân nặng (kg)
 * @param height  Chiều cao (cm)
 * @param age     Tuổi
 * @param gender  'male' | 'female' (mặc định 'male' nếu không truyền)
 */
export function calcBMR(
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female" = "male",
): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

// ─────────────────────────────────────────────
// Main exports
// ─────────────────────────────────────────────

/**
 * Tính TDEE (Total Daily Energy Expenditure) từ UserProfile.
 *
 * TDEE = BMR × activityMultiplier + goalAdjustment
 *
 * Vì UserProfile không chứa gender & activityLevel,
 * hai giá trị đó được truyền riêng với default hợp lý.
 *
 * @param profile        Thông tin người dùng
 * @param activityLevel  Mức độ hoạt động (mặc định 'moderate')
 * @param gender         Giới tính (mặc định 'male')
 * @returns              TDEE đã được làm tròn (kcal/ngày)
 */
export function calcTDEE(
  profile: UserProfile,
  activityLevel: ActivityLevel = "moderate",
  gender: "male" | "female" = "male",
): number {
  const { weight, height, age, goal } = profile;

  const bmr = calcBMR(weight, height, age, gender);
  const maintenance = bmr * ACTIVITY_MULTIPLIER[activityLevel];
  const tdee = maintenance + GOAL_ADJUSTMENT[goal];

  return Math.round(tdee);
}

/**
 * Tính mục tiêu macros (protein, carbs, fat) từ tổng calo mục tiêu.
 *
 * Tỷ lệ macro mặc định theo goal 'maintain'.
 * Truyền `goal` để lấy ratio phù hợp hơn.
 *
 * @param calories  Tổng calo mục tiêu (kcal)
 * @param goal      Mục tiêu (lose | maintain | gain), mặc định 'maintain'
 * @returns         MacroTarget với đơn vị gram, đã làm tròn
 */
export function calcMacroTarget(
  calories: number,
  goal: UserProfile["goal"] = "maintain",
): MacroTarget {
  const ratio = MACRO_RATIO[goal];

  return {
    calories: Math.round(calories),
    protein: Math.round((calories * ratio.protein) / CAL_PER_GRAM.protein),
    carbs: Math.round((calories * ratio.carbs) / CAL_PER_GRAM.carbs),
    fat: Math.round((calories * ratio.fat) / CAL_PER_GRAM.fat),
  };
}

/**
 * Shortcut: tính cả TDEE lẫn MacroTarget từ profile trong một lần gọi.
 *
 * @example
 * const { tdee, macros } = calcNutritionPlan(userProfile)
 */
export function calcNutritionPlan(
  profile: UserProfile,
  activityLevel: ActivityLevel = "moderate",
  gender: "male" | "female" = "male",
): { tdee: number; macros: MacroTarget } {
  const tdee = calcTDEE(profile, activityLevel, gender);
  const macros = calcMacroTarget(tdee, profile.goal);
  return { tdee, macros };
}

// ─────────────────────────────────────────────
// Streak Calculation
// ─────────────────────────────────────────────

/**
 * Kiểm tra xem ngày hôm nay có đủ 3 bữa chính không
 * (breakfast, lunch, dinner - không tính snack)
 *
 * @param log - DailyLog cần kiểm tra
 * @returns true nếu đủ 3 bữa chính
 */
export function hasAllMainMeals(log: DailyLog): boolean {
  const mealTypes = new Set(log.meals.map((m) => m.mealType));
  return (
    mealTypes.has("breakfast") &&
    mealTypes.has("lunch") &&
    mealTypes.has("dinner")
  );
}

/**
 * Tính chuỗi liên tục hiện tại từ logs
 * Chỉ tính streak khi có đủ 3 bữa chính (sáng, trưa, tối)
 *
 * @param logs - Mảng DailyLog
 * @returns Số ngày liên tục hiện tại
 */
export function calcCurrentStreak(logs: DailyLog[]): number {
  const logMap = new Map(logs.map((l) => [l.date, l]));
  let streak = 0;
  
  const todayDateStr = toLocalDateStr(new Date());
  const todayLog = logMap.get(todayDateStr);
  const todayCompleted = todayLog && hasAllMainMeals(todayLog);
  
  // If today is completed, we count starting from today (i=0)
  // If today is not completed, we count starting from yesterday (i=1)
  // so the streak isn't visually lost until tomorrow.
  const startIndex = todayCompleted ? 0 : 1;

  for (let i = startIndex; i <= 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const log = logMap.get(toLocalDateStr(d));

    if (log && hasAllMainMeals(log)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Tính best streak (kỷ lục chuỗi liên tục) từ logs
 * Kiểm tra lịch sử để tìm chuỗi dài nhất
 *
 * @param logs - Mảng DailyLog
 * @returns Số ngày streak cao nhất từng đạt được
 */
export function calcBestStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;

  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  for (const log of sortedLogs) {
    if (!hasAllMainMeals(log)) {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 0;
      lastDate = null;
      continue;
    }

    const logDate = new Date(log.date);
    if (lastDate) {
      const daysDiff =
        (logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      // Nếu ngày liên tiếp, tăng streak, nếu không thì reset
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    lastDate = logDate;
  }

  maxStreak = Math.max(maxStreak, currentStreak);
  return maxStreak;

}

