
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";

export default function RootPage() {
  const router = useRouter();

  // Lấy profile từ Zustand store
  const profile = useProfileStore((state) => state.profile);

  // Fix hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Kiểm tra profile hợp lệ
    const hasProfile =
      profile &&
      profile.name &&
      profile.name.trim() !== "";

    // Nếu có profile → dashboard
    if (hasProfile) {
      router.replace("/dashboard");
    }

    // Nếu chưa có → homepage
    else {
      router.replace("/homepage");
    }
  }, [isMounted, profile, router]);

  // Loading screen trong lúc redirect
  return (
    <main className="min-h-screen bg-[#f4fbf6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-[#d6efe1] border-t-[#005239] animate-spin" />

        <p className="text-[#005239] font-semibold tracking-wide">
          CaloMate đang khởi động...
        </p>
      </div>
    </main>
  );
}


