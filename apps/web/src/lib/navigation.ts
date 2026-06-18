export const dashboardNavItems = [
  { href: '/dashboard', label: 'Overview', labelKey: 'nav.dashboard' },
  { href: '/dashboard/albums', label: 'Albums', labelKey: 'nav.albums' },
  { href: '/dashboard/media', label: 'Media', labelKey: 'nav.media' },
  { href: '/dashboard/themes', label: 'Themes', labelKey: 'nav.themes' },
  { href: '/dashboard/settings', label: 'Settings', labelKey: 'nav.settings' },
  { href: '/admin', label: 'Admin', labelKey: 'admin.nav.overview', admin: true },
  { href: '/admin/users', label: 'Users', labelKey: 'admin.nav.users', admin: true },
  { href: '/admin/tenants', label: 'Tenants', labelKey: 'admin.nav.tenants', admin: true },
  { href: '/admin/media', label: 'Media Audit', labelKey: 'admin.nav.media', admin: true },
  { href: '/admin/audit-logs', label: 'Audit Logs', labelKey: 'admin.nav.audit', admin: true },
  { href: '/admin/settings', label: 'Settings', labelKey: 'admin.nav.settings', admin: true },
  { href: '/admin/scale', label: 'Scale', labelKey: 'admin.nav.scale', admin: true },
] as const;
