import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { HomePage } from '../pages/HomePage';
import { WelcomePage } from '../pages/WelcomePage';
import { PrivateRoutes } from './PrivateRoutes';
import { PublicRoutes } from './PublicRoutes';
import { NotificationProvider } from '../context/NotificationContext';

const RootLayout = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </NotificationProvider>
  );
};
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: '/presentations',
            element: <HomePage />,
          },
        ],
      },
      {
        element: <PublicRoutes />,
        children: [
          {
            path: '/',
            element: <WelcomePage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};