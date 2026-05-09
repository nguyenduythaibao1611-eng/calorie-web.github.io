import StatsBoard from "@/components/StatsUI";
// import ProfileForm from "@/components/ProfileForm"; // Comment tạm cái form hôm qua lại

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4FAF7]">
      <div className="py-10 flex justify-center items-center">
        {/* Gọi UI Thống Kê ra đây để test */}
        <StatsBoard />
      </div>
    </main>
  );
}