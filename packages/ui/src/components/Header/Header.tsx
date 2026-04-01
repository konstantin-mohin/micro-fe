import React from 'react';
import { Header as AriaHeader, Heading } from 'react-aria-components';

export interface HeaderProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Header({ title = 'Application Title', className, children }: HeaderProps) {
  return (
    <AriaHeader className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 flex justify-between items-center shadow-md ${className || ''}`}>
      <Heading level={1} className="text-xl font-bold">
        {title}
      </Heading>
      {children}
    </AriaHeader>
  );
}
