'use client'

import { create } from 'zustand'
import type { UserProfile } from '@/types'
import { getProfile, saveProfile } from '@/lib/storage'

type ProfileState = {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  updateProfile: (partial: Partial<UserProfile>) => void
  loadProfile: () => void
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
}))