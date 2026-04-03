import React from 'react';
import { Button as AriaButton, ButtonProps as AriaButtonProps, composeRenderProps } from 'react-aria-components';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'rounded-button font-medium transition-all duration-200 border-none cursor-pointer inline-flex items-center justify-center outline-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600',
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

export interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {
  className?: string;
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (className, renderProps) => cn(
        buttonVariants({ variant, size }),
        renderProps.isPressed && 'scale-95 opacity-90',
        renderProps.isFocused && 'ring-2 ring-blue-400 ring-offset-2',
        renderProps.isHovered && 'brightness-110',
        className
      ))}
    />
  );
}
