import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { Button, Layout } from 'ui';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { RouterProvider } from 'react-aria-components';
import { useNavigate, useHref } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    },
  },
});

const RemoteButton = lazy(() => import('microfrontend_one/Button'));
const Profile = lazy(() => import('microfrontend_one/Profile'));

function DataList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['exampleData'],
    queryFn: async () => {
      const response = await axios.get('/api/data');
      return response.data;
    },
  });

  if (isLoading) return <div className="mt-4 animate-pulse text-gray-500">Loading example data...</div>;
  if (error) return <div className="mt-4 text-red-500">Error loading data</div>;

  return (
    <div className="mt-8 text-left max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Example Data (React Query)</h2>
      <ul className="space-y-3">
        {data.items.map((item: any) => (
          <li key={item.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReactQueryPage() {
  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-extrabold text-purple-600 mb-8">React Query Demo</h1>
      <DataList />
      <div className="mt-8">
        <Link to="/" className="text-blue-500 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}

function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/hello')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">{message} okay </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton />
      </Suspense>
      <div className="mt-5 space-x-4">
        <Button variant="primary">Click Me (UI Package)</Button>
        <Link to="/react-query">
          <Button variant="secondary">Go to React Query Page</Button>
        </Link>
      </div>
      <div className="mt-5">
        <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
      </div>
    </div>
  );
}


function AppContents() {
  const navigate = useNavigate();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/react-query" element={<ReactQueryPage />} />
          </Routes>
        </Suspense>
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
