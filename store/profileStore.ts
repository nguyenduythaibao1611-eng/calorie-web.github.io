'use client'

import { create } from 'zustand'
import type { UserProfile } from '@/types'
import { getProfile, saveProfile } from '@/lib/storage'
import { calculateAndUpdateStreak } from '@/lib/updateStreak'

type ProfileState = {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  updateProfile: (partial: Partial<UserProfile>) => void
  loadProfile: () => void
  /**
   * Tính toán lại streak từ logs và đồng bộ vào cả localStorage lẫn Zustand store.
   * Gọi hàm này trên mỗi trang để đảm bảo streak luôn nhất quán.
   */
  syncStreak: () => void
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,

  // Lưu profile mới hoàn toàn
  setProfile: (profile: UserProfile) => {
    saveProfile(profile)
    set({ profile })
  },

  // Cập nhật một phần profile
  updateProfile: (partial: Partial<UserProfile>) => {
    const current = get().profile
    if (!current) return
    const updated = { ...current, ...partial }
    saveProfile(updated)
    set({ profile: updated })
  },

  // Load profile từ localStorage khi app khởi động
  loadProfile: () => {
    const profile = getProfile()
    set({ profile })
  },

  // Đồng bộ streak: tính lại từ logs, lưu vào localStorage, cập nhật Zustand store
  syncStreak: () => {
    const streak = calculateAndUpdateStreak()
    const current = get().profile
    if (!current) return
    set({
      profile: {
        ...current,
        currentStreak: streak.currentStreak,
        bestStreak: Math.max(streak.bestStreak, current.bestStreak ?? 0),
      },
    })
  },
}))