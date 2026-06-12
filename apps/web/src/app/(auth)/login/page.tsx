import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pearl px-4 py-10">
      <Suspense fallback={<div className="h-80 w-full max-w-sm rounded-md bg-neutral-100" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
