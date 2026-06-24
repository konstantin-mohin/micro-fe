import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OptimisticDemo } from './OptimisticDemo';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    }
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    ),
    queryClient,
  };
};

describe('OptimisticDemo', () => {
  let serverLikes = 10;

  beforeEach(() => {
    jest.clearAllMocks();
    serverLikes = 10; // Reset "server" state
  });

  test('renders item and handles like mutation with optimistic update', async () => {
    mockFetch.mockImplementation(async (url, options) => {
      // GET items
      if (url === '/api/demo-items' && !options) {
        return {
          ok: true,
          json: () => Promise.resolve([{ id: 1, title: 'Test Item', likes: serverLikes }]),
        };
      }
      // POST like (Delayed to allow test to catch optimistic state)
      if (url === '/api/demo-items/1/like' && options?.method === 'POST') {
        await new Promise(r => setTimeout(r, 100)); // 100ms delay
        serverLikes += 1;
        return {
          ok: true,
          json: () => Promise.resolve({ id: 1, title: 'Test Item', likes: serverLikes }),
        };
      }
      return Promise.reject(new Error(`Unknown URL: ${url}`));
    });

    renderWithProviders(<OptimisticDemo />);

    // 1. Initial Render
    await screen.findByText('Test Item');
    expect(screen.getByTestId('likes-count')).toHaveTextContent(/10/);

    const likeButton = screen.getByRole('button', { name: /👍 Like/i });
    
    // 2. Trigger Mutation
    fireEvent.click(likeButton);

    // 3. Verify Optimistic Update (Should see 11 while POST is pending)
    await waitFor(() => {
      expect(screen.getByTestId('likes-count')).toHaveTextContent(/11/);
    });

    // 4. Verify Final State (After POST finishes and refetches)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/demo-items');
    }, { timeout: 2000 });
    
    expect(screen.getByTestId('likes-count')).toHaveTextContent(/11/);
  });

  test('rolls back to previous state on server error', async () => {
    mockFetch.mockImplementation(async (url, options) => {
      if (url === '/api/demo-items' && !options) {
        return {
          ok: true,
          json: () => Promise.resolve([{ id: 1, title: 'Test Item', likes: 10 }]),
        };
      }
      if (url === '/api/demo-items/1/like' && options?.method === 'POST') {
        await new Promise(r => setTimeout(r, 100)); // Delay for rollback visibility
        return {
          ok: false,
          status: 500,
        };
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    renderWithProviders(<OptimisticDemo />);

    await screen.findByText('Test Item');
    const likeButton = screen.getByRole('button', { name: /👍 Like/i });

    fireEvent.click(likeButton);

    // Show optimistic state first
    await waitFor(() => {
      expect(screen.getByTestId('likes-count')).toHaveTextContent(/11/);
    });

    // Wait for the server error message and the rollback to 10 Likes
    await screen.findByText(/Failed to like item 1. Rolling back.../i);
    expect(screen.getByTestId('likes-count')).toHaveTextContent(/10/);
  });
});
