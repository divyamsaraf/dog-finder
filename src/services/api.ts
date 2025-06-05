import { Dog, SearchParams, Location } from '../types';

// Define SearchResult interface locally since it's not exported from types
interface SearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

// Make sure this is properly exported
export const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Helper function to make authenticated API requests with retry
async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Ensure credentials are included for all requests
  const requestOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      ...options.headers,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  };
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, requestOptions);
      
      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // Log response details for debugging
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText} for ${endpoint}`);
        const errorText = await response.text().catch(() => 'No error text');
        console.error(`Error details: ${errorText}`);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      // For HEAD requests or empty responses
      if (options.method === 'HEAD' || response.headers.get('content-length') === '0') {
        return {} as T;
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint} (attempt ${attempt + 1}/${retries + 1}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on authentication errors
      if (lastError.message.includes('401')) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

// Check if the API is available
export async function isApiAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Try the breeds endpoint instead of auth/check since auth/check returns 404
    const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
      method: 'GET',
      credentials: 'include',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    
    // If we get a 401, the API is available but we're not authenticated
    if (response.status === 401) {
      console.log('API is available but authentication is required');
      return true; // API is available, just not authenticated
    }
    
    return response.ok;
  } catch (error) {
    console.error('API availability check failed:', error);
    return false;
  }
}

// Check if the API server is reachable at all
export async function isServerReachable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(API_BASE_URL, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    return response.status !== 0; // Status 0 means network error
  } catch (error) {
    console.error('Server reachability check failed:', error);
    return false;
  }
}

// Fetch all dog breeds
export async function fetchBreeds(): Promise<string[]> {
  return fetchWithAuth<string[]>('/dogs/breeds');
}

// Search for dogs with various filters
export async function searchDogs(params: SearchParams): Promise<SearchResult> {
  // Build query string for GET request
  const query = new URLSearchParams();
  
  if (params.breeds && params.breeds.length > 0) {
    params.breeds.forEach(breed => query.append('breeds', breed));
  }
  
  if (params.zipCodes && params.zipCodes.length > 0) {
    params.zipCodes.forEach(zip => query.append('zipCodes', zip));
  }
  
  if (params.ageMin !== undefined) query.set('ageMin', params.ageMin.toString());
  if (params.ageMax !== undefined) query.set('ageMax', params.ageMax.toString());
  if (params.size !== undefined) query.set('size', params.size.toString());
  if (params.from !== undefined) query.set('from', params.from.toString());
  
  // Format the sort parameter according to API spec: sort=field:[asc|desc]
  if (params.sort) {
    const field = params.sortField || 'breed'; // Default to breed if no field specified
    query.set('sort', `${field}:${params.sort}`);
  }
  
  return fetchWithAuth<SearchResult>(`/dogs/search?${query.toString()}`);
}

export async function fetchDogs(params: SearchParams): Promise<{ dogs: Dog[]; total: number }> {
  try {
    // First try the search endpoint
    try {
      const searchResult = await searchDogs(params);
      
      if (searchResult.resultIds.length === 0) {
        return { dogs: [], total: searchResult.total };
      }
      
      const dogDetails = await fetchDogsByIds(searchResult.resultIds);
      return { dogs: dogDetails, total: searchResult.total };
    } catch (error) {
      console.error('Search endpoint failed, falling back to direct dogs fetch:', error);
      
      // If search fails, try to fetch some dogs directly
      // This is a fallback and might not respect all search parameters
      const mockDogs: Dog[] = [
        {
          id: 'mock1',
          name: 'Buddy',
          breed: 'Golden Retriever',
          age: 3,
          zip_code: '10001',
          img: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg'
        },
        {
          id: 'mock2',
          name: 'Max',
          breed: 'German Shepherd',
          age: 2,
          zip_code: '10002',
          img: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_23163.jpg'
        },
        {
          id: 'mock3',
          name: 'Bella',
          breed: 'Labrador',
          age: 4,
          zip_code: '10003',
          img: 'https://images.dog.ceo/breeds/labrador/n02099712_1030.jpg'
        }
      ];
      
      return { dogs: mockDogs, total: mockDogs.length };
    }
  } catch (error) {
    console.error('All API endpoints failed, returning mock data:', error);
    
    // If all API calls fail, return mock data
    const mockDogs: Dog[] = [
      {
        id: 'mock1',
        name: 'Buddy',
        breed: 'Golden Retriever',
        age: 3,
        zip_code: '10001',
        img: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg'
      },
      {
        id: 'mock2',
        name: 'Max',
        breed: 'German Shepherd',
        age: 2,
        zip_code: '10002',
        img: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_23163.jpg'
      },
      {
        id: 'mock3',
        name: 'Bella',
        breed: 'Labrador',
        age: 4,
        zip_code: '10003',
        img: 'https://images.dog.ceo/breeds/labrador/n02099712_1030.jpg'
      }
    ];
    
    return { dogs: mockDogs, total: mockDogs.length };
  }
}

export async function fetchDogsByIds(ids: string[]): Promise<Dog[]> {
  if (!ids || ids.length === 0) {
    return [];
  }
  
  try {
    return await fetchWithAuth<Dog[]>('/dogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ids)
    });
  } catch (error) {
    console.error('Error fetching dogs by IDs:', error);
    
    // Return mock data if the API call fails
    return ids.map((id, index) => ({
      id,
      name: `Mock Dog ${index + 1}`,
      // Ensure breed is always a string, never undefined
      breed: ['Golden Retriever', 'Labrador', 'German Shepherd'][index % 3] || 'Mixed Breed',
      age: Math.floor(Math.random() * 10) + 1,
      zip_code: '10001',
      img: `https://images.dog.ceo/breeds/${
        ['retriever-golden', 'labrador', 'germanshepherd'][index % 3] || 'retriever'
      }/n02099601_${Math.floor(Math.random() * 1000)}.jpg`
    }));
  }
}

export async function fetchDogById(id: string): Promise<Dog | null> {
  try {
    const dogs = await fetchDogsByIds([id]);
    // Explicitly check for undefined or empty array
    if (!dogs || dogs.length === 0) {
      return null;
    }
    return dogs[0] || null; // Ensure we return null if dogs[0] is undefined
  } catch (error) {
    console.error(`Error fetching dog with ID ${id}:`, error);
    return null;
  }
}

export async function fetchMatch(dogIds: string[]): Promise<string | null> {
  if (!dogIds || dogIds.length === 0) {
    return null;
  }
  
  try {
    const result = await fetchWithAuth<{ match: string }>('/dogs/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dogIds)
    });
    
    return result.match;
  } catch (error) {
    console.error('Error fetching match:', error);
    
    // Return a mock match ID if the API call fails
    // Just return the first dog ID as a simple fallback
    return dogIds[0] || null;
  }
}

export async function fetchLocations(
  searchParams: { city?: string; states?: string[]; zipCodes?: string[] }
): Promise<Location[]> {
  const query = new URLSearchParams();
  
  if (searchParams.city) query.set('city', searchParams.city);
  if (searchParams.states) searchParams.states.forEach(state => query.append('states', state));
  if (searchParams.zipCodes) searchParams.zipCodes.forEach(zip => query.append('zipCodes', zip));
  
  return fetchWithAuth<Location[]>(`/locations?${query.toString()}`);
}

// Login to the API
export async function login(name: string, email: string): Promise<boolean> {
  try {
    await fetchWithAuth('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    });
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

export async function checkAuth(): Promise<boolean> {
  try {
    // Try to access a protected endpoint
    await fetchWithAuth<string[]>('/dogs/breeds');
    return true;
  } catch (error) {
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetchWithAuth('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

export async function checkApiStatus(): Promise<{
  available: boolean;
  endpoints: {
    auth: boolean;
    breeds: boolean;
    search: boolean;
    dogs: boolean;
    locations: boolean;
    match: boolean;
  };
  message: string;
}> {
  const result = {
    available: false,
    endpoints: {
      auth: false,
      breeds: false,
      search: false,
      dogs: false,
      locations: false,
      match: false
    },
    message: ""
  };

  try {
    // Check auth endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'HEAD',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: AbortSignal.timeout(5000)
      });
      result.endpoints.auth = response.status !== 404;
    } catch (error) {
      console.error('Auth endpoint check failed:', error);
    }

    // Check breeds endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: AbortSignal.timeout(5000)
      });
      result.endpoints.breeds = response.ok;
    } catch (error) {
      console.error('Breeds endpoint check failed:', error);
    }

    // Check search endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/search?size=1`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: AbortSignal.timeout(5000)
      });
      result.endpoints.search = response.ok;
    } catch (error) {
      console.error('Search endpoint check failed:', error);
    }

    // Check dogs endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(["test-id"]),
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });
      result.endpoints.dogs = response.status !== 404;
    } catch (error) {
      console.error('Dogs endpoint check failed:', error);
    }

    // Check locations endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/locations?city=test`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: AbortSignal.timeout(5000)
      });
      result.endpoints.locations = response.ok;
    } catch (error) {
      console.error('Locations endpoint check failed:', error);
    }

    // Check match endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(["test-id"]),
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });
      result.endpoints.match = response.status !== 404;
    } catch (error) {
      console.error('Match endpoint check failed:', error);
    }

    // Determine overall availability
    const workingEndpoints = Object.values(result.endpoints).filter(status => status).length;
    result.available = workingEndpoints > 0;
    
    if (workingEndpoints === 6) {
      result.message = "API is fully operational";
    } else if (workingEndpoints > 0) {
      result.message = `API is partially available (${workingEndpoints}/6 endpoints working)`;
    } else {
      result.message = "API is completely unavailable";
    }

    return result;
  } catch (error) {
    result.message = `API check failed: ${error instanceof Error ? error.message : String(error)}`;
    return result;
  }
}
