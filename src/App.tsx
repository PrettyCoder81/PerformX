import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import type { RootState } from './store';
import getTheme from './theme';
import Layout from './components/layout/Layout';
import AuthGuard from './components/AuthGuard';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Todos from './pages/Todos';
import Login from './pages/Login';
import Register from './pages/Register';

const ThemedApp: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/auth/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

      {/* Protected routes */}
      <Route path="/*" element={
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </AuthGuard>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
};

export default App;
