import { Suspense } from 'react';
import { VerifyEmailPanel } from '@/features/auth/verify-email-panel';

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pearl px-4 py-10">
      <Suspense fallback={<div className="h-56 w-full max-w-md rounded-md bg-neutral-100" />}>
        <VerifyEmailPanel />
      </Suspense>
    </main>
  );
}
