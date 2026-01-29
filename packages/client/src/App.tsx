import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { Button } from 'ui';

const RemoteButton = lazy(() => import('microfrontend_one/Button'));
const Layout = lazy(() => import('layout/Layout'));

function App() {
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
    <Suspense fallback={<div>Loading Layout...</div>}>
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>{message} okay </h1>
          <Suspense fallback={<div>Loading Button...</div>}>
            <RemoteButton />
          </Suspense>
          <div style={{ marginTop: '20px' }}>
            <Button />
          </div>
        </div>
      </Layout>
    </Suspense>
  );
}

export default App;
