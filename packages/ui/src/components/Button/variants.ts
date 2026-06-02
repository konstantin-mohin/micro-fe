import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'rounded-button font-medium transition-all duration-200 border-none cursor-pointer inline-flex items-center justify-center outline-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
      },
      size: {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2 text-base',
        lg: 'px-8 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
