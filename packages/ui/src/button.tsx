import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-neutral-950 text-white hover:bg-neutral-800',
  secondary: 'bg-white text-neutral-950 ring-1 ring-neutral-200 hover:bg-neutral-50',
  ghost: 'text-neutral-700 hover:bg-neutral-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
