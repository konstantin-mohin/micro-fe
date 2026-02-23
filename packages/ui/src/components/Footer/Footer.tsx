import React from 'react';
import { Text } from 'react-aria-components';

export interface FooterProps {
  copyright?: string;
  className?: string;
}

export function Footer({ copyright = 'Copyright 2026', className }: FooterProps) {
  return (
    <footer className={`bg-gray-100 p-4 mt-auto border-t border-gray-200 ${className || ''}`}>
      <Text elementType="p" className="text-sm text-gray-500 text-center">
        {copyright}
      </Text>
    </footer>
  );
}
