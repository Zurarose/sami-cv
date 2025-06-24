import { getCsrfToken } from 'next-auth/react';
import { cookies } from 'next/headers';
import { Button } from '@/ui-kit/basic/button';
import { Input } from '@/ui-kit/basic/input';
import { Label } from '@/ui-kit/basic/label';
import { ERROR_MESSAGES } from '@/constant/messages';
import { apiRoutes } from '@/constant/routes';

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const { error } = await searchParams;
  const errorMessage = ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES];

  const cookieStore = await cookies();
  const csrfToken = await getCsrfToken({
    req: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8 space-y-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground">Sign in to your account</p>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>

          {/* Form */}
          <form
            method="post"
            action={apiRoutes.signinEmail}
            className="space-y-6"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" size="lg">
              Sign in with Email
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">SAMI-CV platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
