import Link from 'next/link';
import type { ReactNode } from 'react';
import { dashboardNavItems } from '@/lib/navigation';

export function AppShell({
  children,
  section,
}: {
  children: ReactNode;
  section: 'dashboard' | 'admin';
}) {
  const navItems =
    section === 'dashboard'
      ? dashboardNavItems.filter((item) => !('admin' in item))
      : dashboardNavItems.filter((item) => 'admin' in item);

  return (
    <div className="min-h-screen bg-pearl">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-white px-4 py-5 lg:block">
        <Link href="/dashboard" className="block text-lg font-semibold text-ink">
          The Wedding
        </Link>
        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
