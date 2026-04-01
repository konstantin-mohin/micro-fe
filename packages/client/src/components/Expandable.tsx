"use client";

import React, { useState } from 'react';

export default function Expandable({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-2 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Note Item</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm hover:bg-purple-200 transition-colors dark:bg-purple-800 dark:text-purple-100 dark:hover:bg-purple-700"
        >
          {expanded ? 'Hide Content' : 'Toggle'}
        </button>
      </div>
      {expanded && (
        <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-700 rounded border-t border-gray-100 dark:border-gray-600 animate-in fade-in duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
