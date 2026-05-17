/**
 * lib/updateStreak.ts
 *
 * Helper để cập nhật streak trong profile khi có log mới
 */

import { calcCurrentStreak, calcBestStreak, toLocalDateStr } from "./calc";
import { getLogs, getProfile, saveProfile } from "./storage";

/**
 * Cập nhật currentStreak và bestStreak trong profile từ tất cả logs
 * Hàm này được gọi khi:
 * - Thêm bữa ăn mới
 * - Xóa bữa ăn
 * - Cập nhật bữa ăn
 *
 * Streak được persist vào profile sau khi tính toán, đảm bảo
 * hàm self-contained và không phụ thuộc vào caller để lưu dữ liệu.
 *
 * @returns Object chứa { currentStreak, bestStreak }
 */
export function calculateAndUpdateStreak(): {
  currentStreak: number;
  bestStreak: number;
} {
  // Lấy tất cả logs từ năm trước đến hiện tại
  // Dùng toLocalDateStr() thay vì toISOString() để tránh lệch ngày
  // với người dùng UTC+7 (Việt Nam) sau 17:00 UTC (00:00 giờ VN)
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  const start = toLocalDateStr(startDate);
  const end = toLocalDateStr(new Date());

  const allLogs = getLogs(start, end);

  const currentStreak = calcCurrentStreak(allLogs);
  const bestStreak = calcBestStreak(allLogs);

  // Persist streak vào profile để tránh mất dữ liệu khi reload trang
  const profile = getProfile();
  if (profile) {
    saveProfile({
      ...profile,
      currentStreak,
      // Dùng Math.max để bestStreak không bị ghi đè bởi giá trị thấp hơn
      bestStreak: Math.max(bestStreak, profile.bestStreak ?? 0),
    });
  }

  return { currentStreak, bestStreak };
}