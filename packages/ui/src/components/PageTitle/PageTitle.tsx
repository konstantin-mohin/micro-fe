import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const titleVariants = cva(
  'font-extrabold mb-8 tracking-tight',
  {
    variants: {
      size: {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl',
        xl: 'text-5xl',
      },
      intent: {
        primary: 'text-blue-600 dark:text-blue-400',
        secondary: 'text-gray-600 dark:text-gray-400',
        neutral: 'text-gray-900 dark:text-gray-100',
      }
    },
    defaultVariants: {
      size: 'lg',
      intent: 'primary',
    }
  }
);

export interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof titleVariants> {
  children: React.ReactNode;
}

export function PageTitle({ children, className, size, intent, ...props }: PageTitleProps) {
  return (
    <h1 
      {...props}
      className={cn(titleVariants({ size, intent }), className)}
    >
      {children}
    </h1>
  );
}
