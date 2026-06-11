import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pearl px-4 py-10">
      <form className="w-full max-w-sm rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-ink">Reset password</h1>
        <label className="mt-6 grid gap-2 text-sm font-medium text-neutral-700">
          Email
          <input
            className="rounded-md border-neutral-300"
            type="email"
            name="email"
            autoComplete="email"
          />
        </label>
        <button
          className="mt-4 h-10 w-full rounded-md bg-ink px-4 text-sm font-medium text-white"
          type="submit"
        >
          Send reset link
        </button>
        <p className="mt-4 text-sm text-neutral-600">
          <Link href="/login">Back to sign in</Link>
        </p>
      </form>
    </main>
  );
}
