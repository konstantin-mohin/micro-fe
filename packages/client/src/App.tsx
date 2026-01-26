import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';

const RemoteButton = lazy(() => import('microfrontend-one/Button'));

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message} okay </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton />
      </Suspense>
    </div>
  );
}

export default App;
