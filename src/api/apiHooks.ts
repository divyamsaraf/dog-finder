import { useState, useEffect, useCallback } from "react";
import { API_BASE, Dog } from "../types";
import { checkAuth, login as apiLogin, logout as apiLogout } from "../services/api";

// -------- Authentication Hook --------
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if user is authenticated - memoized with useCallback
  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch (e: any) {
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login: sends credentials, browser sets HttpOnly cookie automatically
  async function login(name: string, email: string): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const success = await apiLogin(name, email);
      if (!success) throw new Error("Login failed");
      setIsAuthenticated(true);
    } catch (e: any) {
      setError(e.message);
      setIsAuthenticated(false);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  // Logout: clears auth cookie server-side
  async function logout(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await apiLogout();
      setIsAuthenticated(false);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { login, logout, checkAuthentication, isAuthenticated, loading, error };
}

// -------- Fetch Breeds --------
export function useBreeds() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBreeds() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/dogs/breeds`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch breeds");
        const data = await res.json();
        setBreeds(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBreeds();
  }, []);

  return { breeds, loading, error };
}

// -------- Dog Search --------
interface DogSearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}

interface DogSearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export function useDogSearch(params: DogSearchParams) {
  const [result, setResult] = useState<DogSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDogs() {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();

        params.breeds?.forEach((b) => query.append("breeds", b));
        params.zipCodes?.forEach((z) => query.append("zipCodes", z));
        if (params.ageMin !== undefined) query.set("ageMin", params.ageMin.toString());
        if (params.ageMax !== undefined) query.set("ageMax", params.ageMax.toString());
        if (params.size !== undefined) query.set("size", params.size.toString());
        if (params.from !== undefined) query.set("from", params.from.toString());
        if (params.sort) query.set("sort", params.sort);

        const res = await fetch(`${API_BASE}/dogs/search?${query.toString()}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to search dogs");
        const data = await res.json();
        setResult(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDogs();
  // Make sure to add all params as deps, flatten arrays to strings to avoid infinite loops
  }, [
    params.breeds?.join(","),
    params.zipCodes?.join(","),
    params.ageMin,
    params.ageMax,
    params.size,
    params.from,
    params.sort,
  ]);

  return { result, loading, error };
}

// -------- Dogs by IDs --------
export function useDogsByIds(dogIds: string[]) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dogIds.length === 0) {
      setDogs([]);
      return;
    }
    async function fetchDogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/dogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(dogIds.slice(0, 100)), // limit 100 ids max
        });
        if (!res.ok) throw new Error("Failed to fetch dog details");
        const data: Dog[] = await res.json();
        setDogs(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDogs();
  }, [dogIds.join(",")]);

  return { dogs, loading, error };
}

// -------- Dog Match --------
export function useDogMatch() {
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchMatch(dogIds: string[]) {
    setLoading(true);
    setError(null);
    setMatch(null);
    try {
      const res = await fetch(`${API_BASE}/dogs/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dogIds.slice(0, 100)),
      });
      if (!res.ok) throw new Error("Failed to fetch dog match");
      const data = await res.json();
      setMatch(data.match);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { fetchMatch, loading, match, error };
}
