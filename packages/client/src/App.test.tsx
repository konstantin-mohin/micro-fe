import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock axios to prevent network errors in tests
jest.mock('axios');

// Mock the remote modules
jest.mock('microfrontend_one/Button', () => () => <button>Remote Button</button>, { virtual: true });

describe('App', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockImplementation((url) => {
      if (url === '/api/hello') {
        return Promise.resolve({ data: { message: 'Mocked Hello' } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the main heading with mocked data', async () => {
    render(<App />);
    // Wait for the mocked axios call to resolve and update the state
    expect(await screen.findByRole('heading', { name: /Mocked Hello okay/i })).toBeInTheDocument();
  });

  test('renders the shared UI button', async () => {
    render(<App />);
    expect(await screen.findByRole('button', { name: /Click Me \(UI Package\)/i })).toBeInTheDocument();
  });

  test('renders the remote button from microfrontend-one', async () => {
    render(<App />);
    expect(await screen.findByRole('button', { name: /Remote Button/i })).toBeInTheDocument();
  });
});
