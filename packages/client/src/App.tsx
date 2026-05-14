import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-aria-components';
import { useNavigate, useHref } from 'react-router-dom';
import { Layout } from 'ui';
import { AppRoutes } from './routes';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './lib/theme';
import { DevProfiler } from './components/DevProfiler';

import { ThemeToggle } from './components/ThemeToggle';

function AppContents() {
  const navigate = useNavigate();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Layout headerChildren={<ThemeToggle />}>
        <AppRoutes />
      </Layout>
    </RouterProvider>
  );
}

function App() {
  return (
    <DevProfiler id="app">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AppContents />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </DevProfiler>
  );
}

export default App;
