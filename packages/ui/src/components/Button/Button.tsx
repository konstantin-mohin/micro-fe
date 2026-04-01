import React from 'react';
import { Button as AriaButton, ButtonProps as AriaButtonProps, composeRenderProps } from 'react-aria-components';
import { cn } from '../../lib/utils';

export interface ButtonProps extends AriaButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-md dark:bg-blue-700 dark:hover:bg-blue-800',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
  };

  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (className, renderProps) => cn(
        'px-6 py-2 rounded-lg font-medium transition-all duration-200 border-none cursor-pointer inline-flex items-center justify-center',
        variantStyles[variant],
        renderProps.isPressed && 'scale-95 opacity-90',
        renderProps.isFocused && 'ring-2 ring-blue-400 ring-offset-2 outline-none',
        renderProps.isHovered && 'brightness-110',
        className
      ))}
    />
  );
}
