import { DashboardLayout } from '@/ui-kit/composite/layout';

export default function layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
