/**
 * types/index.ts
 *
 * Định nghĩa các kiểu dữ liệu (TypeScript Interfaces) cho dự án Calorie-Web
 * Các interface được sắp xếp theo thứ tự dependency (từ đơn giản đến phức tạp)
 */

/**
 * Mục tiêu dinh dưỡng hàng ngày của người dùng
 *
 * Lưu trữ các giá trị target cho calo, protein, carbs và fat.
 * Được sử dụng trong UserProfile để thiết lập mục tiêu cá nhân.
 */
export interface MacroTarget {
  /** Mục tiêu calo hàng ngày (kcal) */
  calories: number
  /** Mục tiêu protein hàng ngày (gram) */
  protein: number
  /** Mục tiêu carbs hàng ngày (gram) */
  carbs: number
  /** Mục tiêu fat hàng ngày (gram) */
  fat: number
}

/**
 * Thông tin hồ sơ người dùng
 *
 * Chứa thông tin cá nhân, mục tiêu sức khỏe và mục tiêu dinh dưỡng.
 * Đây là dữ liệu cố định cho mỗi người dùng.
 */
export interface UserProfile {
  /** Tên đầy đủ của người dùng */
  name: string
  /** Tuổi của người dùng (năm) */
  age: number
  /** Cân nặng hiện tại (kg) */
  weight: number
  /** Chiều cao (cm) */
  height: number
  /** Mục tiêu sức khỏe: giảm cân, duy trì, hoặc tăng cân */
  goal: 'lose' | 'maintain' | 'gain'
  /** Mục tiêu dinh dưỡng hàng ngày (chứa MacroTarget) */
  macroTarget: MacroTarget
}

/**
 * Nguyên liệu trong một bữa ăn
 *
 * Mỗi bữa ăn có thể chứa nhiều nguyên liệu.
 * Lưu trữ thông tin về tên, calo, macros (protein, carbs, fat) và số lượng.
 */
export interface Ingredient {
  id: string
  /** Tên nguyên liệu (ví dụ: "Gạo trắng", "Cá hồi") */
  name: string
  /** Lượng calo trong 100g hoặc 1 đơn vị */
  calories: number
  /** Lượng protein (gram) */
  protein: number
  /** Lượng carbs (gram) */
  carbs: number
  /** Lượng fat (gram) */
  fat: number
  /** Số lượng (100g, 1 cốc, 1 miếng, v.v.) */
  amount?: number
}

/**
 * Một bữa ăn cụ thể
 *
 * Chứa thông tin về loại bữa ăn (breakfast, lunch, ...), các nguyên liệu
 * và tính toán tổng calo.
 */
export interface MealEntry {
  /** ID duy nhất của bữa ăn */
  id: string
  /** Loại bữa ăn: sáng, trưa, chiều, ăn nhẹ */
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  /** Danh sách các nguyên liệu trong bữa ăn (chứa Ingredient[]) */
  ingredients: Ingredient[]
  /** Tổng calo của bữa ăn (tính từ các nguyên liệu) */
  totalCalories: number
  /** Thời gian bữa ăn (định dạng HH:mm, ví dụ: "12:30") */
  time: string
}

/**
 * Nhật ký calo một ngày
 *
 * Chứa tất cả các bữa ăn trong một ngày và tổng calo tiêu thụ.
 * Được sử dụng để theo dõi hàng ngày và phân tích xu hướng.
 */
export interface DailyLog {
  /** Ngày ghi nhật ký (định dạng YYYY-MM-DD, ví dụ: "2024-05-08") */
  date: string
  /** Danh sách các bữa ăn trong ngày (chứa MealEntry[]) */
  meals: MealEntry[]
  /** Tổng calo tiêu thụ trong ngày (tính từ các bữa ăn) */
  totalCalories: number
  /** Lượng nước uống trong ngày (đơn vị: ly) */
  water: number
}
