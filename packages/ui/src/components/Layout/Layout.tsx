import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Sidebar } from '../Sidebar';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Layout({ children, title, className }: LayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen ${className || ''}`}>
      <Header title={title} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
