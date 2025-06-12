import axios from 'axios';
import { Dog, SearchParams } from '../types';

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true // Important for cookie-based authentication
});

/**
 * Authenticates a user with the API
 * @param name - User's name
 * @param email - User's email
 * @returns Promise resolving to authentication success status
 */
export const login = async (name: string, email: string): Promise<boolean> => {
  try {
    const response = await api.post('/auth/login', { name, email });
    return response.status === 200;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

/**
 * Logs out the current user
 * @returns Promise resolving to logout success status
 */

export const logout = async (): Promise<boolean> => {
  try {
    const response = await api.post('/auth/logout');
    return response.status === 200;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};

// Check if user is authenticated
export const checkAuth = async (): Promise<boolean> => {
  try {
    // We'll use the breeds endpoint to check auth status
    const response = await api.get('/dogs/breeds');
    return response.status === 200;
  } catch (error) {
    // This is expected if not authenticated, so we don't need to log it as an error
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log('User not authenticated');
      return false;
    } else {
      console.error('Auth check failed:', error);
      return false;
    }
  }
};

/**
 * Fetches all available dog breeds
 * @returns Promise resolving to array of breed strings
 */
  export const fetchBreeds = async (): Promise<string[]> => {
  try {
    const response = await api.get('/dogs/breeds');
    return response.data;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    throw error;
  }
};


/**
 * Searches for dogs based on provided parameters
 * @param params - Search parameters including filters, pagination, and sorting
 * @returns Promise resolving to search results with dog IDs and pagination info
 */

export const searchDogs = async (params: SearchParams, page = 1): Promise<{ resultIds: string[], total: number, next?: string, prev?: string }> => {
  try {
    // Create URLSearchParams object for query parameters
    const queryParams = new URLSearchParams();
    
    // Add breed filters if provided
    if (params.breeds && params.breeds.length > 0) {
      params.breeds.forEach(breed => queryParams.append('breeds', breed));
    }
    
    // Add zip code filters if provided
    if (params.zipCodes && params.zipCodes.length > 0) {
      params.zipCodes.forEach(zip => queryParams.append('zipCodes', zip));
    }
    
    // Add age filters if provided
    if (params.ageMin !== undefined) {
      queryParams.append('ageMin', params.ageMin.toString());
    }
    
    if (params.ageMax !== undefined) {
      queryParams.append('ageMax', params.ageMax.toString());
    }
    
    // Add pagination parameters
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
    } else {
      queryParams.append('size', '20'); // Default page size
    }
    
    if (params.from !== undefined) {
      queryParams.append('from', params.from.toString());
    } else if (page > 1) {
      // Calculate 'from' based on page number and size
      const size = params.size || 20;
      queryParams.append('from', ((page - 1) * size).toString());
    }
    
    // Add sorting if provided
    if (params.sort && params.sortField) {
      queryParams.append('sort', `${params.sortField}:${params.sort}`);
    }
    
    // Make GET request with query parameters
    const response = await api.get(`/dogs/search?${queryParams.toString()}`);
    
    return {
      resultIds: response.data.resultIds || [],
      total: response.data.total || 0,
      next: response.data.next,
      prev: response.data.prev
    };
  } catch (error) {
    console.error('Error searching dogs:', error);
    throw error;
  }
};

/**
 * Fetches detailed information for dogs by their IDs
 * @param ids - Array of dog IDs to fetch
 * @returns Promise resolving to array of Dog objects
 */

export const fetchDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  try {
    const response = await api.post('/dogs', ids);
    return response.data;
  } catch (error) {
    console.error('Error fetching dogs by IDs:', error);
    throw error;
  }
};

/**
 * Generates a match based on favorited dog IDs
 * @param favoriteIds - Array of favorited dog IDs
 * @returns Promise resolving to matched dog ID
 */

export const generateMatch = async (dogIds: string[]): Promise<string> => {
  try {
    const response = await api.post('/dogs/match', dogIds);
    return response.data.match;
  } catch (error) {
    console.error('Error generating match:', error);
    throw error;
  }
};

/**
 * Generates a random match by selecting a random dog
 * @returns Promise resolving to a randomly selected Dog object
 */

export const generateRandomMatch = async (): Promise<string> => {
  try {
    // First, get a list of breeds
    const breeds = await fetchBreeds();
    
    // Select a random breed
    const randomBreed = breeds.length > 0 ? breeds[Math.floor(Math.random() * breeds.length)] : null;
    
    // Search for dogs of that breed with a small page size
    const searchParams: SearchParams = {
      breeds: randomBreed ? [randomBreed] : undefined,
      size: 100 // Get a larger sample to choose from
    };
    
    const searchResult = await searchDogs(searchParams);
    
    if (searchResult.resultIds.length === 0) {
      // If no dogs found with that breed, try a general search
      const generalSearch = await searchDogs({ size: 100 });
      if (generalSearch.resultIds.length === 0) {
        throw new Error('No dogs found in the database');
      }
      
      // Pick a random dog ID from the results
      const randomIndex = Math.floor(Math.random() * generalSearch.resultIds.length);
      const randomId = generalSearch.resultIds[randomIndex];
      
      // Ensure we have a valid string ID
      if (!randomId) {
        throw new Error('Failed to get a valid dog ID');
      }
      
      return randomId;
    }
    
    // Pick a random dog ID from the results
    const randomIndex = Math.floor(Math.random() * searchResult.resultIds.length);
    const randomId = searchResult.resultIds[randomIndex];
    
    // Ensure we have a valid string ID
    if (!randomId) {
      throw new Error('Failed to get a valid dog ID');
    }
    
    return randomId;
  } catch (error) {
    console.error('Error generating random match:', error);
    throw error;
  }
};

