import React from 'react';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 border border-ink-900',
  secondary: 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 hover:text-ink-900',
  ghost: 'bg-transparent text-ink-600 border border-transparent hover:bg-ink-100 hover:text-ink-900',
  danger: 'bg-signal-red text-white border border-signal-red hover:bg-[#a53125]'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2'
};

export function Button({ variant = 'secondary', size = 'sm', className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-150',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}>
      
      {children}
    </button>);

}