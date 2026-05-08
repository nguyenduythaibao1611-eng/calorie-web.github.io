import { Home } from "lucide-react";
import { BottomNav } from "@/components/ui";
import ProfileForm from "@/components/ProfileForm"; // 1. Import phải nằm ở trên cùng nè

export default function Page() {
  return (
    <div>
      <div>
        <Home />
        App Ready
      </div>

      <h1>Home</h1>

      {/* 2. Đặt cái form của ông vào giữa màn hình, ngay trên cái thanh BottomNav của anh em */}
      <ProfileForm />

      <BottomNav />
    </div>
  );
}