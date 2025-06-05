import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { THEME } from '../App';
import { isApiAvailable, fetchBreeds } from '../services/api';

const ApiStatusPage: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const [breedsAvailable, setBreedsAvailable] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkApiStatus = async () => {
    setIsCheckingStatus(true);
    
    try {
      // Check basic API availability
      const available = await isApiAvailable();
      setIsAvailable(available);
      
      // If available, check if breeds endpoint works
      if (available) {
        try {
          const breeds = await fetchBreeds();
          setBreedsAvailable(breeds && breeds.length > 0);
        } catch (error) {
          console.error('Error fetching breeds:', error);
          setBreedsAvailable(false);
        }
      } else {
        setBreedsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      setIsAvailable(false);
      setBreedsAvailable(false);
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
      color: THEME.darkText
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
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Breeds Endpoint</h2>
          {isCheckingStatus ? (
            <p>Checking breeds endpoint...</p>
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
                backgroundColor: breedsAvailable ? '#4caf50' : '#f44336'
              }} />
              <span>{breedsAvailable ? 'Available' : 'Unavailable'}</span>
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
        
        <div style={{ marginTop: '30px' }}>
          <Link 
            to="/"
            style={{
              color: THEME.primary,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            &larr; Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusPage;