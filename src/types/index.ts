// Dog related types
export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string; // Direction (asc or desc)
  sortField?: string; // Field to sort by
}

export interface SearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

// Location related types
export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

// Authentication related types
export interface User {
  name: string;
  email: string;
}

// API response types
export interface Match {
  match: string;
}

// State types
export interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
}

export const API_BASE = "https://frontend-take-home-service.fetch.com";
