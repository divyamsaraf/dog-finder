import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';

/**
 * Main application component that handles routing and authentication
 * Provides protected routes and authentication redirects
 */
function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Display loading indicator while authentication state is being determined
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
      {/* Only show header when user is authenticated */}
      {isAuthenticated && <Header onLogout={logout} />}
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          {/* Public route - redirects to home if already authenticated */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <LoginPage />
            } 
          />
          
          {/* Protected route - redirects to login if not authenticated */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <SearchPage /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Protected route - redirects to login if not authenticated */}
          <Route 
            path="/favorites" 
            element={
              isAuthenticated ? 
                <FavoritesPage /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch-all route - redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
