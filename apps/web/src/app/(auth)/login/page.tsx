import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pearl px-4 py-10">
      <form className="w-full max-w-sm rounded-md border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-ink">Sign in</h1>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-neutral-700">
            Email
            <input
              className="rounded-md border-neutral-300"
              type="email"
              name="email"
              autoComplete="email"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-neutral-700">
            Password
            <input
              className="rounded-md border-neutral-300"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </label>
          <button
            className="h-10 rounded-md bg-ink px-4 text-sm font-medium text-white"
            type="submit"
          >
            Sign in
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
          <Link href="/forgot-password">Forgot password</Link>
          <Link href="/register">Create account</Link>
        </div>
      </form>
    </main>
  );
}
