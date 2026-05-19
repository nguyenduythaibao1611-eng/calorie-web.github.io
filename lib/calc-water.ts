import { calcTDEE, type ActivityLevel } from "./calc";
import type { UserProfile } from "@/types";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

/**
 * Lượng nước bổ sung theo mức độ hoạt động (ml)
 * Sedentary không cộng thêm vì baseline đã tính đủ
 */
const ACTIVITY_WATER_BONUS: Record<ActivityLevel, number> = {
  sedentary: 0,
  light:     200,
  moderate:  400,
  active:    600,
  veryActive: 800,
};

/**
 * Bổ sung thêm cho người lớn tuổi (>55) vì cảm giác khát giảm dần
 */
const ELDER_BONUS = 200; // ml
const ELDER_AGE_THRESHOLD = 55;

/**
 * Nữ giới nhu cầu nước thấp hơn nam ~10%
 */
const FEMALE_ADJUSTMENT = -200; // ml

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

/**
 * Tính lượng nước tối thiểu cần uống mỗi ngày (ml), làm tròn đến bội số 100.
 *
 * Công thức baseline theo goal:
 *  - lose     : weight × 40ml  (tăng nước hỗ trợ trao đổi chất & giảm đói)
 *  - maintain : TDEE × 1ml     (1ml/kcal theo khuyến nghị WHO, nhất quán với calcTDEE)
 *  - gain     : weight × 38ml  (tăng nhẹ để hỗ trợ tổng hợp cơ)
 *
 * Điều chỉnh thêm:
 *  + activity bonus  : +0 / +200 / +400 / +600 / +800 ml theo mức độ vận động
 *  + elder bonus     : +200ml nếu tuổi > 55
 *  + gender          : −200ml nếu là nữ
 *
 * @param profile        Thông tin người dùng (weight, age, goal)
 * @param activityLevel  Mức độ hoạt động (mặc định 'moderate')
 * @param gender         Giới tính (mặc định 'male')
 * @returns              Lượng nước tối thiểu (ml), là bội số của 100
 *
 * @example
 * calcMinWater({ weight: 70, age: 28, goal: "lose", ... }, "moderate", "male")
 * // → 3200
 */
export function calcMinWater(
  profile: UserProfile,
  activityLevel: ActivityLevel = "moderate",
  gender: "male" | "female" = "male",
): number {
  const { weight, age, goal } = profile;

  // ── Baseline theo goal ──────────────────────
  let baseline: number;

  if (goal === "lose") {
    baseline = weight * 40;
  } else if (goal === "gain") {
    baseline = weight * 38;
  } else {
    // maintain: dùng lại TDEE × 1ml, nhất quán với hệ thống
    const tdee = calcTDEE(profile, activityLevel, gender);
    baseline = tdee * 1;
  }

  // ── Điều chỉnh bổ sung ──────────────────────
  const activityBonus = ACTIVITY_WATER_BONUS[activityLevel];
  const elderBonus    = age > ELDER_AGE_THRESHOLD ? ELDER_BONUS : 0;
  const genderAdj     = gender === "female" ? FEMALE_ADJUSTMENT : 0;

  const total = baseline + activityBonus + elderBonus + genderAdj;

  // ── Làm tròn đến bội số 100 ─────────────────
  return Math.round(total / 100) * 100;
}