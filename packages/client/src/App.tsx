import { QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './lib/theme';
import { DevProfiler } from './components/DevProfiler';

function App() {
  return (
    <DevProfiler id="app">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </QueryClientProvider>
    </DevProfiler>
  );
}

export default App;
