'use client';

import { ERROR_MESSAGES } from '@/constant/messages';
import { Button } from '@/ui-kit/basic/button';
import { Input } from '@/ui-kit/basic/input';
import { Label } from '@/ui-kit/basic/label';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export const SignInComponent = ({
  csrfToken,
  error,
}: {
  csrfToken: string;
  error?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const errorMessage = ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setIsLoading(true);
    const result = await signIn('email', {
      email: formData.get('email'),
    });
    if (result?.error) {
      toast.error(ERROR_MESSAGES.CredentialsSignin);
      return;
    }
    setIsLoading(false);
  };

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
          <form onSubmit={onSubmit} className="space-y-6">
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

            <Button
              type="submit"
              className="w-full h-11"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
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
};
