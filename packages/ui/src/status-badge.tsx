import type { ReactNode } from 'react';

export type StatusBadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

export type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusBadgeTone;
};

const toneClasses: Record<StatusBadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
};

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
