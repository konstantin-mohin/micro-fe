import React from 'react';
import { Header as AriaHeader, Heading } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const headerVariants = cva(
  'p-4 flex justify-between items-center shadow-md transition-colors',
  {
    variants: {
      intent: {
        white: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white',
        primary: 'bg-blue-600 text-white dark:bg-blue-800',
        transparent: 'bg-transparent shadow-none',
      },
      sticky: {
        true: 'sticky top-0 z-50',
        false: 'relative',
      }
    },
    defaultVariants: {
      intent: 'white',
      sticky: false,
    }
  }
);

export interface HeaderProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof headerVariants> {
  title?: string;
  children?: React.ReactNode;
}

export function Header({ title = 'Application Title', className, intent, sticky, children, ...props }: HeaderProps) {
  return (
    <AriaHeader 
      {...props}
      className={cn(headerVariants({ intent, sticky }), className)}
    >
      <Heading level={1} className="text-xl font-bold">
        {title}
      </Heading>
      {children}
    </AriaHeader>
  );
}
