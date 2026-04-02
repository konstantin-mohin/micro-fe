import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { RSCPage } from './RSCPage';
import { ComponentTreeRenderer } from './ComponentTreeRenderer';

// Mock axios
jest.mock('axios');

// Mock ComponentTreeRenderer so we can inspect what gets passed to it
jest.mock('./ComponentTreeRenderer', () => ({
  ComponentTreeRenderer: jest.fn(() => <div data-testid="mock-renderer" />)
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for testing
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('RSCPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state initially', () => {
    // Keep the promise unresolved to test the loading state
    (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<RSCPage />);

    expect(screen.getByText(/Rendering RSC from server.../i)).toBeInTheDocument();
  });

  test('shows error message when the server request fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    renderWithProviders(<RSCPage />);

    // Wait for the query to fail and display the error message
    expect(await screen.findByText(/Failed to render RSC/i)).toBeInTheDocument();
  });

  test('passes dynamic server payload directly to the ComponentTreeRenderer', async () => {
    // We create a completely arbitrary, dynamic payload
    // We don't care what's inside it, just that it gets passed down.
    const dynamicServerPayload = {
      type: 'DynamicServerComponent',
      data: {
        randomId: Math.random(),
        message: 'This could be anything from the server'
      },
      children: [
        { type: 'Child', id: 1 }
      ]
    };

    (axios.get as jest.Mock).mockResolvedValue({ data: dynamicServerPayload });

    renderWithProviders(<RSCPage />);

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Rendering RSC from server.../i)).not.toBeInTheDocument();
    });

    // Verify the ComponentTreeRenderer was called
    expect(ComponentTreeRenderer).toHaveBeenCalled();

    // Verify that the EXACT dynamic payload received from axios was passed to the 'node' prop
    // This proves we aren't hardcoding the structure in the page itself
    expect(ComponentTreeRenderer).toHaveBeenCalledWith(
      expect.objectContaining({ node: dynamicServerPayload }),
      undefined // The second argument in React components is typically the ref, which is undefined here
    );

    // Verify the mock renderer actually rendered on screen
    expect(screen.getByTestId('mock-renderer')).toBeInTheDocument();
  });
});
