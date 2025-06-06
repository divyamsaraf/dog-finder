import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';

function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on app load
  useEffect(() => {
    // Only redirect if not on login page and not loading
    if (!isAuthenticated && !isLoading && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Show loading spinner only when checking auth on protected routes
  if (isLoading && location.pathname !== '/login') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Header onLogout={logout} />}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <LoginPage />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <SearchPage /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              isAuthenticated ? 
                <FavoritesPage /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
