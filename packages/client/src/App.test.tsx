import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the remote modules
jest.mock('microfrontend_one/Button', () => () => <button>Remote Button</button>, { virtual: true });
jest.mock('layout/Layout', () => ({ children }) => <div>{children}</div>, { virtual: true });

describe('App', () => {
  test('renders the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /okay/i })).toBeInTheDocument();
  });

  test('renders the shared UI button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Click Me \(UI Package\)/i })).toBeInTheDocument();
  });

  test('renders the remote button from microfrontend-one', async () => {
    render(<App />);
    expect(await screen.findByRole('button', { name: /Remote Button/i })).toBeInTheDocument();
  });
});
