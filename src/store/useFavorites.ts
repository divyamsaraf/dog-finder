import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dog } from '../types';

// State interface for the favorites store
interface FavoritesState {
  favorites: Dog[];
  addFavorite: (dog: Dog) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

/**
 * Zustand store for managing favorite dogs
 * 
 * Features:
 * - Add/remove dogs from favorites
 * - Check if a dog is in favorites
 * - Clear all favorites
 * - Persist favorites in local storage
 */

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      // Add a dog to favorites if not already present
      addFavorite: (dog) => 
        set((state) => ({
          favorites: state.favorites.some(fav => fav.id === dog.id) 
            ? state.favorites 
            : [...state.favorites, dog]
        })),
      
      // Remove a dog from favorites
      removeFavorite: (id) => 
        set((state) => ({
          favorites: state.favorites.filter(dog => dog.id !== id)
        })),
      
      // Clear all favorites
      clearFavorites: () => 
        set({ favorites: [] }),
      /**
       * Check if a dog is in favorites by ID
       * @param id - ID of the dog to check
       * @returns Boolean indicating if the dog is in favorites
       */
      
      isFavorite: (id) => 
        get().favorites.some(dog => dog.id === id)
    }),
    {
      name: 'dog-favorites-storage',
    }
  )
);
