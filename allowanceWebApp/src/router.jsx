import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import TransferPage from './pages/TransferPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import RatesPage from './pages/RatesPage';
import AdsPage from './pages/AdsPage';
import RequireAuth from './components/RequireAuth';
import NotFoundPage from './pages/NotFoundPage';
import AppErrorBoundary from './components/AppErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <LandingPage />, errorElement: <AppErrorBoundary /> },
      { path: 'login', element: <LoginPage />, errorElement: <AppErrorBoundary /> },
      { path: 'signup', element: <SignupPage />, errorElement: <AppErrorBoundary /> },
      {
        path: 'dashboard',
        element: <RequireAuth />, errorElement: <AppErrorBoundary />,
        children: [
          {
            element: <DashboardLayout />, errorElement: <AppErrorBoundary />,
            children: [
              { index: true, element: <DashboardPage />, errorElement: <AppErrorBoundary /> },
              { path: 'transfer', element: <TransferPage />, errorElement: <AppErrorBoundary /> },
              { path: 'transactions', element: <TransactionHistoryPage />, errorElement: <AppErrorBoundary /> },
              { path: 'rates', element: <RatesPage />, errorElement: <AppErrorBoundary /> },
              { path: 'ads', element: <AdsPage />, errorElement: <AppErrorBoundary /> },
              { path: '*', element: <NotFoundPage />, errorElement: <AppErrorBoundary /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage />, errorElement: <AppErrorBoundary /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
