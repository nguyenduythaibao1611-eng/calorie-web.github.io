// app/settings/page.tsx
import ProfileForm from "@/components/ProfileForm";

export default function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cài đặt tài khoản</h1>
      <ProfileForm />
    </div>
  );
}