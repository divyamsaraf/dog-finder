import { useState, useEffect, useCallback } from 'react';
import { checkApiStatus } from '../services/api';

export const useApiStatus = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const status = await checkApiStatus();
      setIsAvailable(status);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to check API status');
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    isAvailable,
    isChecking,
    lastChecked,
    error,
    checkStatus
  };
};