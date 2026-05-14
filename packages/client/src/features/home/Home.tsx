import { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { Button, PageTitle } from 'ui';
import { Link } from 'react-router-dom';

const RemoteButton = lazy(() => import('microfrontend_one/Button'));

interface HelloResponse {
  message: string;
}

export function Home() {
  //TODO: use react-query for data fetching and caching
  //const { 
  //   data: message, 
  //   isLoading, 
  //   isError, 
  //   error 
  // } = useQuery({
  //   queryKey: ['helloMessage'], // Unique key for caching
  //   queryFn: fetchHelloMessage,
  //   retry: 1, // Optional 
  //   // });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Setup AbortController to prevent memory leaks
    const controller = new AbortController();

    axios.get<HelloResponse>('/api/hello', { signal: controller.signal })
      .then(response => {
        setMessage(response.data.message);
        setError(null);
      })
      .catch((err: unknown) => {
        // 2. Ignore errors caused by unmounting
        if (axios.isCancel(err)) return;

        // 3. Type-safe Axios error handling
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error('There was an error fetching the data!', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Cleanup function runs on unmount
    return () => controller.abort();
  }, []);

  return (
    <div className="text-center mt-12">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 inline-block" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <PageTitle>
        {isLoading ? 'Loading...' : `${message} okay`}
      </PageTitle>

      <Suspense fallback={<div>Loading Remote Button...</div>}>
        <RemoteButton />
      </Suspense>

      <div className="mt-5 space-x-4">
        <Button variant="primary">Click Me (UI Package)</Button>
        <Link to="/react-query">
          <Button variant="secondary">Go to React Query Page</Button>
        </Link>
        <Link to="/server-driven-ui">
          <Button variant="secondary" className="bg-indigo-500 text-white hover:bg-indigo-600">Go to Server-Driven UI Page</Button>
        </Link>
      </div>
      <div className="mt-5">
        <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
      </div>
    </div>
  );
}
