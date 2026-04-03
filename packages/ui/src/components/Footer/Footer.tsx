import React from 'react';
import { Text } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const footerVariants = cva(
  'p-6 mt-auto border-t transition-colors',
  {
    variants: {
      intent: {
        neutral: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        white: 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800',
        transparent: 'bg-transparent border-transparent',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-10',
      }
    },
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    }
  }
);

export interface FooterProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof footerVariants> {
  copyright?: string;
  children?: React.ReactNode;
}

export function Footer({ copyright = 'Copyright 2026', className, intent, size, children, ...props }: FooterProps) {
  return (
    <footer 
      {...props}
      className={cn(footerVariants({ intent, size }), className)}
    >
      <div className="flex flex-col items-center gap-4">
        {children}
        <Text elementType="p" className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {copyright}
        </Text>
      </div>
    </footer>
  );
}
