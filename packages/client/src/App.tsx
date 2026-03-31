import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-aria-components';
import { useNavigate, useHref } from 'react-router-dom';
import { Layout } from 'ui';
import { AppRoutes } from './routes';
import { queryClient } from './lib/queryClient';

function AppContents() {
  const navigate = useNavigate();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Layout>
        <AppRoutes />
      </Layout>
    </RouterProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContents />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
