import React from 'react';
import { Header as AriaHeader, Heading } from 'react-aria-components';

export interface HeaderProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Header({ title = 'Application Title', className, children }: HeaderProps) {
  return (
    <AriaHeader className={`bg-gray-800 text-white p-4 flex justify-between items-center ${className || ''}`}>
      <Heading level={1} className="text-xl font-bold">
        {title}
      </Heading>
      {children}
    </AriaHeader>
  );
}
