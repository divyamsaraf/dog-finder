import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (dogId: string) => void;
  removeFavorite: (dogId: string) => void;
  clearFavorites: () => void;
  isFavorited: (dogId: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (dogId: string) => {
        const { favorites } = get();
        if (!favorites.includes(dogId)) {
          set({ favorites: [...favorites, dogId] });
        }
      },
      
      removeFavorite: (dogId: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(id => id !== dogId) });
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
      
      isFavorited: (dogId: string) => {
        return get().favorites.includes(dogId);
      },
    }),
    {
      name: 'dog-favorites-storage',
    }
  )
);
