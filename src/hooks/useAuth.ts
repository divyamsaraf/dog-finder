import { useState, useCallback, useEffect, useRef } from 'react';
import { login as apiLogin, logout as apiLogout, checkAuth } from '../services/api';
import { useLocation } from 'react-router-dom';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isCheckingRef = useRef(false);
  const location = useLocation();

  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    // Prevent duplicate checks
    if (isCheckingRef.current) {
      return isAuthenticated;
    }
    
    isCheckingRef.current = true;
    setIsLoading(true);
    
    try {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
      return isAuth;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
      isCheckingRef.current = false;
    }
  }, [isAuthenticated]);

  // Check authentication on initial load, but skip on login page
  useEffect(() => {
    // Don't check auth on the login page
    if (location.pathname !== '/login') {
      checkAuthentication();
    }
  }, [checkAuthentication, location.pathname]);

  const login = async (name: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await apiLogin(name, email);
      setIsAuthenticated(success);
      setIsLoading(false);
      return success;
    } catch (e: any) {
      setError(e.message);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await apiLogout();
      setIsAuthenticated(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    checkAuthentication 
  };
}
