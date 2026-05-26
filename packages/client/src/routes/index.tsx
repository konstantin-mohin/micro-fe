import { lazy, Suspense } from 'react';
import { Home } from '../features/home';
import { ReactQueryPage } from '../features/react-query';
import { ServerDrivenUIPage } from '../features/server-driven-ui';
import { BigListPage, bigListLoader } from '../features/big-list';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useNavigate,
  useHref
} from 'react-router-dom';
import { RouterProvider as AriaRouterProvider } from 'react-aria-components';
import { Layout } from 'ui';
import { ThemeToggle } from '../components/ThemeToggle';

const Profile = lazy(() => import('microfrontend_one/Profile'));

function Root() {
  const navigate = useNavigate();

  return (
    <AriaRouterProvider navigate={navigate} useHref={useHref}>
      <Layout headerChildren={<ThemeToggle />}>
        <Outlet />
      </Layout>
    </AriaRouterProvider>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/" element={<Home />} />

      {/* Keep Suspense wrapping your lazy-loaded MFE */}
      <Route
        path="/profile"
        element={
          <Suspense fallback={<div>Loading Profile...</div>}>
            <Profile />
          </Suspense>
        }
      />

      <Route path="/react-query" element={<ReactQueryPage />} />

      <Route
        path="/big-list"
        element={<BigListPage />}
        loader={bigListLoader}
      />

      <Route path="/server-driven-ui" element={<ServerDrivenUIPage />} />
    </Route>
  )
);

// Your AppRoutes component now just provides the router
export function AppRoutes() {
  return <RouterProvider router={router} />;
}
