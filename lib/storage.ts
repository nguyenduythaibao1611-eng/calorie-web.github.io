/**
 * lib/storage.ts
 *
 * Storage Layer - Quản lý localStorage an toàn
 * Tất cả truy cập vào localStorage phải thông qua các hàm trong file này
 *
 * Không truy cập localStorage trực tiếp từ UI/component!
 */

import { UserProfile, DailyLog } from "@/types/index";

/**
 * Khóa (keys) sử dụng trong localStorage
 */
const STORAGE_KEYS = {
  /** Khóa lưu profile người dùng */
  PROFILE: "calorie_profile",
  /** Tiền tố khóa cho logs hàng ngày (sẽ kết hợp với date: "calorie_log_2026-05-08") */
  LOG_PREFIX: "calorie_log_",
} as const;

/**
 * Hàm hỗ trợ: An toàn parse JSON
 * Nếu lỗi, log warning và trả về null thay vì crash
 */
function safeJsonParse<T>(json: string | null): T | null {
  if (!json) return null;

  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.warn("[Storage] Lỗi parse JSON:", error);
    return null;
  }
}

/**
 * Hàm hỗ trợ: Kiểm tra xem có phải ở client-side không
 * (localStorage chỉ có trên browser, không có trên server)
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

// ============================================
// PROFILE - Quản lý thông tin người dùng
// ============================================

/**
 * Đọc thông tin hồ sơ người dùng từ localStorage
 *
 * @returns UserProfile nếu tồn tại, null nếu chưa có hoặc lỗi
 */
export function getProfile(): UserProfile | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as UserProfile;
    // Ensure legacy profiles get default streak values
    if (parsed.currentStreak === undefined || parsed.currentStreak === null) {
      parsed.currentStreak = 0;
    }
    if (parsed.bestStreak === undefined || parsed.bestStreak === null) {
      parsed.bestStreak = 0;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Lưu thông tin hồ sơ người dùng vào localStorage
 *
 * @param profile - UserProfile cần lưu
 */
export function saveProfile(profile: UserProfile): void {
  if (!isBrowser()) return;

  try {
    // Ensure streak fields exist before saving
    const copy = { ...profile };
    if (copy.currentStreak === undefined || copy.currentStreak === null)
      copy.currentStreak = 0;
    if (copy.bestStreak === undefined || copy.bestStreak === null)
      copy.bestStreak = 0;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(copy));
  } catch (error) {
    console.warn("[Storage] Lỗi lưu profile:", error);
  }
}

// ============================================
// LOGS - Quản lý nhật ký calo hàng ngày
// ============================================

/**
 * Tạo khóa localStorage cho một ngày cụ thể
 *
 * @param date - Ngày (format YYYY-MM-DD)
 * @returns Khóa localStorage, vd: "calorie_log_2026-05-08"
 */
function getLogKey(date: string): string {
  return `${STORAGE_KEYS.LOG_PREFIX}${date}`;
}

/**
 * Đọc nhật ký calo của một ngày cụ thể
 *
 * @param date - Ngày cần đọc (format: "YYYY-MM-DD")
 * @returns DailyLog nếu tồn tại, null nếu chưa có hoặc lỗi
 */
export function getLog(date: string): DailyLog | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(getLogKey(date));
    return raw ? (JSON.parse(raw) as DailyLog) : null;
  } catch {
    return null;
  }
}

/**
 * Lưu nhật ký calo cho một ngày cụ thể
 *
 * @param date - Ngày cần lưu (format: "YYYY-MM-DD")
 * @param log - DailyLog cần lưu
 */
export function saveLog(date: string, log: DailyLog): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(getLogKey(date), JSON.stringify(log));
  } catch (error) {
    console.warn("[Storage] Lỗi lưu log:", error);
  }
}

/**
 * Lấy tất cả nhật ký calo trong khoảng thời gian
 *
 * @param startDate - Ngày bắt đầu (format: "YYYY-MM-DD")
 * @param endDate - Ngày kết thúc (format: "YYYY-MM-DD")
 * @returns Mảng DailyLog được sắp xếp theo ngày
 */
export function getLogs(startDate: string, endDate: string): DailyLog[] {
  if (!isBrowser()) return [];

  try {
    const logs: DailyLog[] = [];

    // Iterate qua tất cả localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Kiểm tra xem có phải log key không
      if (key && key.startsWith(STORAGE_KEYS.LOG_PREFIX)) {
        // Extract ngày từ key (format: "calorie_log_2026-05-08" -> "2026-05-08")
        const dateFromKey = key.substring(STORAGE_KEYS.LOG_PREFIX.length);

        // Kiểm tra xem ngày có nằm trong khoảng không
        if (dateFromKey >= startDate && dateFromKey <= endDate) {
          const raw = localStorage.getItem(key);
          const log = safeJsonParse<DailyLog>(raw);

          if (log) {
            logs.push(log);
          }
        }
      }
    }

    // Sắp xếp theo ngày tăng dần
    return logs.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.warn("[Storage] Lỗi lấy logs:", error);
    return [];
  }
}

