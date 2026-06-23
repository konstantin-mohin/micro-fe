import { render, screen, fireEvent } from '@testing-library/react';
import { DependentQueriesDemo } from './DependentQueriesDemo';
import { TestStoreWrapper } from '../../components/TestStoreWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('DependentQueriesDemo', () => {
  it('renders correctly in idle mode', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DependentQueriesDemo />
      </QueryClientProvider>
    );

    expect(screen.getByText('Dependent Queries')).toBeInTheDocument();
    expect(screen.getByText('Waterfall')).toBeInTheDocument();
    expect(screen.getByText('Optimized')).toBeInTheDocument();
    expect(screen.getByText('Select a mode to compare loading patterns in the Network tab.')).toBeInTheDocument();
  });

  it('switches to waterfall mode on click', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DependentQueriesDemo />
      </QueryClientProvider>
    );

    const waterfallBtn = screen.getByText('Waterfall');
    fireEvent.click(waterfallBtn);

    expect(await screen.findByText('Waterfall: Requests are sequential (A → B → C). Total time: ~2.4s')).toBeInTheDocument();
  });

  it('switches to optimized mode on click', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DependentQueriesDemo />
      </QueryClientProvider>
    );

    const optimizedBtn = screen.getByText('Optimized');
    fireEvent.click(optimizedBtn);

    expect(await screen.findByText('Optimized: Step 2 requests fire in parallel once Step 1 finishes. Total time: ~1.6s')).toBeInTheDocument();
  });
});