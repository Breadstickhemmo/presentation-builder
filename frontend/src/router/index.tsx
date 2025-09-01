import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { WelcomePage } from '../pages/WelcomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/presentations',
    element: <HomePage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};