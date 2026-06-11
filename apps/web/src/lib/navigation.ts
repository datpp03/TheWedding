export const dashboardNavItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/albums', label: 'Albums' },
  { href: '/dashboard/media', label: 'Media' },
  { href: '/dashboard/themes', label: 'Themes' },
  { href: '/dashboard/settings', label: 'Settings' },
  { href: '/admin', label: 'Admin', admin: true },
  { href: '/admin/users', label: 'Users', admin: true },
  { href: '/admin/tenants', label: 'Tenants', admin: true },
  { href: '/admin/media', label: 'Media Audit', admin: true },
  { href: '/admin/audit-logs', label: 'Audit Logs', admin: true },
] as const;
