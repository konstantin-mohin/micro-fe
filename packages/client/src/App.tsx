import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { Button, Layout } from 'ui';
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
    <div className="text-center mt-12">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">{message} okay </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteButton />
      </Suspense>
      <div className="mt-5">
        <Button variant="primary">Click Me (UI Package)</Button>
      </div>
      <div className="mt-5">
        <Link to="/profile" className="text-blue-500 hover:underline">Go to Profile</Link>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
