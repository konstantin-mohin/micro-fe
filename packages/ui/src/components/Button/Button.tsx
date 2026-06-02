import React from 'react';
import { Button as AriaButton, ButtonProps as AriaButtonProps, composeRenderProps } from 'react-aria-components';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { buttonVariants } from './variants';

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
