import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pearl px-4 py-10">
      <Suspense fallback={<div className="h-96 w-full max-w-md rounded-md bg-neutral-100" />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
