import { DashboardLayout } from '@/ui-kit/composite/layout';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return <DashboardLayout user={session?.user}>{children}</DashboardLayout>;
}
