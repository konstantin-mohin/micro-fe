import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Sidebar } from '../Sidebar';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  headerChildren?: React.ReactNode;
}

export function Layout({ children, title, className, headerChildren }: LayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white ${className || ''}`}>
      <Header title={title}>
        {headerChildren}
      </Header>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-white dark:bg-gray-800">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
