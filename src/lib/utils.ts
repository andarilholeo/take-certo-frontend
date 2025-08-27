import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mobile-first breakpoint utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Common mobile-first responsive patterns
export const responsive = {
  container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 sm:grid-cols-2',
    cols3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  },
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
  },
  spacing: {
    section: 'py-8 sm:py-12 lg:py-16',
    card: 'p-4 sm:p-6',
  }
} as const;

// Touch-friendly sizing utilities
export const touch = {
  target: 'min-h-[44px] min-w-[44px]', // Apple's recommended minimum touch target
  button: 'h-11 px-4 sm:h-12 sm:px-6',
  input: 'h-11 px-3 sm:h-12 sm:px-4',
} as const;
