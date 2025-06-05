import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean; // Add flag to prevent multiple checks
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isCheckingAuth: false, // Initialize flag
      
      setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      setLoading: (value: boolean) => set({ isLoading: value }),
      setError: (error: string | null) => set({ error }),
      
      login: async (name: string, email: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
          });
          
          const success = response.ok;
          set({ isAuthenticated: success, isLoading: false });
          return success;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false,
            isAuthenticated: false 
          });
          return false;
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          set({ isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed', 
            isLoading: false 
          });
        }
      },
      
      checkAuth: async () => {
        // Check if already checking auth to prevent multiple calls
        if (get().isCheckingAuth) {
          return get().isAuthenticated;
        }
        
        set({ isLoading: true, error: null, isCheckingAuth: true });
        try {
          const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
            credentials: 'include',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          const isAuthenticated = response.ok;
          set({ isAuthenticated, isLoading: false, isCheckingAuth: false });
          return isAuthenticated;
        } catch (error) {
          set({ 
            isAuthenticated: false, 
            isLoading: false,
            isCheckingAuth: false,
            error: error instanceof Error ? error.message : 'Authentication check failed' 
          });
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
