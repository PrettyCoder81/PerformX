import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import type { RootState } from './store';
import theme from './theme';
import Layout from './components/layout/Layout';
import AuthGuard from './components/AuthGuard';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

const AuthRedirect: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return null;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Auth routes - redirect to dashboard if already authenticated */}
      <Route
        path="/auth/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/auth/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Register />
        }
      />
      <Route path="/auth/reset-password" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </AuthGuard>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
