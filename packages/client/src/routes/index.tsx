import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../features/home';
import { ReactQueryPage } from '../features/react-query';
import { RSCPage } from '../features/rsc';

const Profile = lazy(() => import('microfrontend_one/Profile'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/react-query" element={<ReactQueryPage />} />
        <Route path="/rsc" element={<RSCPage />} />
      </Routes>
    </Suspense>
  );
}
