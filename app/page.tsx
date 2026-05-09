'use client';

import { useEffect, useState } from "react";
import DashboardPage from "@/components/dashboard/DashboardPage";
import ProfileForm from "@/components/ProfileForm";
import { useProfileStore } from "@/store/profileStore";

export default function Home() {
  const profile = useProfileStore((state) => state.profile);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix: Đảm bảo Client đã sẵn sàng
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-[#f4fbf6]" />;
  }

  // Kiểm tra nếu đã có profile hợp lệ
  const hasProfile = profile && profile.name && profile.name.trim() !== "";

  return (
    <main>
      {/* Nếu có profile thì vào Dashboard, nếu không thì bắt nhập Profile */}
      {hasProfile ? <DashboardPage /> : <ProfileForm />}
    </main>
  );
}