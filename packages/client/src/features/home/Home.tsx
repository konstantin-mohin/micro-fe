import { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { Button, PageTitle } from 'ui';
import { Link } from 'react-router-dom';

const RemoteButton = lazy(() => import('microfrontend_one/Button'));

export function Home() {
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
      <PageTitle>{message} okay </PageTitle>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton />
      </Suspense>
      <div className="mt-5 space-x-4">
        <Button variant="primary">Click Me (UI Package)</Button>
        <Link to="/react-query">
          <Button variant="secondary">Go to React Query Page</Button>
        </Link>
        <Link to="/rsc">
          <Button variant="secondary" className="bg-indigo-500 text-white hover:bg-indigo-600">Go to RSC Page</Button>
        </Link>
      </div>
      <div className="mt-5">
        <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
      </div>
    </div>
  );
}
