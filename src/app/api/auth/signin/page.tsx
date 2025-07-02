import { getCsrfToken } from 'next-auth/react';
import { cookies } from 'next/headers';
import { SignInComponent } from '@/components/signin';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/option';
import { routes } from '@/constant/routes';
import { redirect } from 'next/navigation';

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(routes.documents);
  }
  const { error } = await searchParams;

  const cookieStore = await cookies();
  const csrfToken = await getCsrfToken({
    req: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });

  return <SignInComponent csrfToken={csrfToken || ''} error={error} />;
}
