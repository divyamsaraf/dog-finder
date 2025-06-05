import React, { useState } from 'react';
import { THEME } from '../App';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Please enter both name and email');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important for storing cookies
        body: JSON.stringify({ name, email })
      });
      
      if (response.ok) {
        console.log('Login successful');
        // Add a small delay to ensure cookies are properly set
        setTimeout(() => {
          onLogin();
        }, 500);
      } else {
        // Handle specific error codes
        if (response.status === 401) {
          setError('Invalid credentials. Please check your name and email.');
        } else if (response.status === 429) {
          setError('Too many login attempts. Please try again later.');
        } else {
          setError(`Login failed with status: ${response.status}. Please try again.`);
        }
        console.error('Login failed with status:', response.status);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '32px', 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: THEME.primary, 
          marginBottom: '24px', 
          textAlign: 'center',
          fontSize: '1.75rem'
        }}>
          Dog Finder
        </h1>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '16px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="name" 
              style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: THEME.text,
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              Name
            </label>
            <input 
              id="name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: `1px solid ${THEME.border}`,
                fontSize: '1rem'
              }} 
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '6px', 
                color: THEME.text,
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              Email
            </label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: `1px solid ${THEME.border}`,
                fontSize: '1rem'
              }} 
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: THEME.primary, 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '1rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
