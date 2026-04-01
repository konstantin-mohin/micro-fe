import React from 'react';

export interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={`text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-8 ${className || ''}`}>
      {children}
    </h1>
  );
}
