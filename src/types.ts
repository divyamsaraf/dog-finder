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
  sort?: string; // This will be the direction only (asc or desc)
  sortField?: string; // This will be the field to sort by
}

export interface SearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Match {
  match: string;
}

export const API_BASE = "https://frontend-take-home-service.fetch.com";
