import { AppShell } from '@/components/nav/AppShell';
import DashboardPage from '@/components/dashboard/DashboardPage';

export default function Page() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}