import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../lib/theme';
import { ThemeToggle } from './ThemeToggle';

// Mock component to display the current theme from the hook
const ThemeDisplay = () => {
  const { theme } = useTheme();
  return <div data-testid="theme-display">{theme}</div>;
};

describe('Theme Functionality', () => {
  beforeEach(() => {
    // Clear localStorage and document classes before each test
    localStorage.clear();
    document.documentElement.className = '';
    
    // Mock window.matchMedia for default system preference (light mode)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false, // false means 'light' is preferred by system
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('provides default light theme when no system preference or local storage', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );

    // Initial state should be light
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
    // Root element should have 'light' class
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('respects system preference for dark mode', () => {
    // Mock system preference to dark mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: true, // true means 'dark' is preferred
      })),
    });

    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );

    // Initial state should be dark based on system preference
    expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('prioritizes localStorage over system preference', () => {
    // Set localStorage to light, but system to dark
    localStorage.setItem('theme', 'light');
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: true, // system wants dark
      })),
    });

    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );

    // Should be light because of localStorage
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  test('toggles theme and updates localStorage and DOM classes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeDisplay />
      </ThemeProvider>
    );

    // Starts light
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
    
    // Find the toggle button
    const toggleButton = screen.getByRole('button', { name: /Switch to Dark Mode/i });
    expect(toggleButton).toBeInTheDocument();

    // Click it to switch to dark
    fireEvent.click(toggleButton);

    // Assert UI updated
    expect(screen.getByTestId('theme-display')).toHaveTextContent('dark');
    expect(screen.getByRole('button', { name: /Switch to Light Mode/i })).toBeInTheDocument();
    
    // Assert DOM updated
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);

    // Assert localStorage updated
    expect(localStorage.getItem('theme')).toBe('dark');
    
    // Click again to switch back to light
    const newToggleButton = screen.getByRole('button', { name: /Switch to Light Mode/i });
    fireEvent.click(newToggleButton);

    // Assert UI and DOM and localStorage reverted
    expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
