import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { Button } from 'ui';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const RemoteButton = lazy(() => import('microfrontend_one/Button'));
const Profile = lazy(() => import('microfrontend_one/Profile'));

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{message} okay </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton />
      </Suspense>
      <div style={{ marginTop: '20px' }}>
        <Button />
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link to="/profile">Go to Profile</Link>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
