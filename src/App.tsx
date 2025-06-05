import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { Dog } from './types';

// Create auth service
const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};

const logout = async (): Promise<void> => {
  try {
    await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Theme colors
export const THEME = {
  primary: "#3498db", // Brighter blue
  secondary: "#f39c12", // Warmer gold
  accent: "#1abc9c", // Teal
  background: "#f8f9fa",
  cardBg: "#FFFFFF",
  text: "#2c3e50",
  lightText: "#7f8c8d",
  border: "#e9ecef",
  success: "#2ecc71",
  error: "#e74c3c",
  shadow: "rgba(0, 0, 0, 0.08)"
};

// DogCard component
export const DogCard: React.FC<{ 
  dog: Dog; 
  isFavorite: boolean; 
  onToggleFavorite: (id: string) => void;
}> = ({ dog, isFavorite, onToggleFavorite }) => {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      backgroundColor: 'white',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
        <img 
          src={dog.img} 
          alt={dog.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <button
          onClick={() => onToggleFavorite(dog.id)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: THEME.primary }}>{dog.name}</h3>
        <p style={{ margin: '0 0 8px 0', fontSize: '1rem' }}><strong>Breed:</strong> {dog.breed}</p>
        <p style={{ margin: '0 0 8px 0', fontSize: '1rem' }}><strong>Age:</strong> {dog.age} {dog.age === 1 ? 'year' : 'years'}</p>
        <p style={{ margin: '0 0 8px 0', fontSize: '1rem' }}><strong>Location:</strong> {dog.zip_code}</p>
      </div>
    </div>
  );
};

// Create ApiStatusPage component
const ApiStatusPage: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkApiStatus = async () => {
    setIsCheckingStatus(true);
    
    try {
      // Check basic API availability
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      setIsAvailable(response.ok);
    } catch (error) {
      console.error('Error checking API status:', error);
      setIsAvailable(false);
    } finally {
      setIsCheckingStatus(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      color: THEME.text
    }}>
      <h1 style={{ color: THEME.primary, marginBottom: '20px' }}>API Status</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>API Connection</h2>
          {isCheckingStatus ? (
            <p>Checking API status...</p>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                backgroundColor: isAvailable ? '#4caf50' : '#f44336'
              }} />
              <span>{isAvailable ? 'Connected' : 'Disconnected'}</span>
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <p>Last checked: {lastChecked}</p>
          <button 
            onClick={checkApiStatus}
            disabled={isCheckingStatus}
            style={{
              backgroundColor: THEME.primary,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isCheckingStatus ? 'not-allowed' : 'pointer',
              opacity: isCheckingStatus ? 0.7 : 1
            }}
          >
            {isCheckingStatus ? 'Checking...' : 'Check Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when app loads
    const checkAuthentication = async () => {
      setIsCheckingAuth(true);
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (isCheckingAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: THEME.background
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: THEME.primary, marginBottom: 16 }}>Loading...</h2>
          <p style={{ color: THEME.lightText }}>Checking authentication status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={{ backgroundColor: THEME.background, minHeight: '100vh' }}>
      {isAuthenticated && (
        <header style={{ 
          backgroundColor: THEME.primary, 
          padding: '15px 24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Dog Finder</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => navigate('/api-status')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              API Status
            </button>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Logout
            </button>
          </div>
        </header>
      )}
      
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <LoginPage onLogin={handleLogin} />
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
        <Route path="/api-status" element={<ApiStatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
