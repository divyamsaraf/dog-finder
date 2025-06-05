import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DogCard, THEME } from '../App';
import { Dog, SearchParams, API_BASE } from '../types';
import Select from 'react-select';
import { useFavorites } from '../store/useFavorites';
import { 
  fetchBreeds, 
  fetchDogs, 
  isApiAvailable as checkApiAvailability,
  fetchDogsByIds,
  fetchMatch
} from '../services/api';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(
    queryParams.getAll('breed') || []
  );
  const [zipCode, setZipCode] = useState<string>(
    queryParams.get('zipCode') || ''
  );
  const [ageMin, setAgeMin] = useState<number | undefined>(
    queryParams.get('ageMin') ? Number(queryParams.get('ageMin')) : undefined
  );
  const [ageMax, setAgeMax] = useState<number | undefined>(
    queryParams.get('ageMax') ? Number(queryParams.get('ageMax')) : undefined
  );
  const [page, setPage] = useState(
    queryParams.get('page') ? Number(queryParams.get('page')) : 0
  );
  const [sortField, setSortField] = useState<string>('breed');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  
  const { favorites, addFavorite, removeFavorite, isFavorited } = useFavorites();

  const pageSize = 12;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    selectedBreeds.forEach(breed => params.append('breed', breed));
    if (zipCode) params.set('zipCode', zipCode);
    if (ageMin !== undefined) params.set('ageMin', ageMin.toString());
    if (ageMax !== undefined) params.set('ageMax', ageMax.toString());
    if (page > 0) params.set('page', page.toString());
    params.set('sort', sortOrder);
    params.set('sortField', sortField);
    
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedBreeds, zipCode, ageMin, ageMax, page, sortOrder, sortField, navigate]);

  useEffect(() => {
    async function checkApiStatus() {
      try {
        const available = await checkApiAvailability();
        setApiAvailable(available);
        
        if (!available) {
          console.warn('API is not available. Using mock data.');
          setApiError("The API service appears to be unavailable. Showing mock data for demonstration purposes.");
        } else {
          // If API is available but we're getting 401 errors, we need to redirect to login
          const authResponse = await fetch(`${API_BASE}/dogs/breeds`, {
            credentials: 'include',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          
          if (authResponse.status === 401) {
            console.warn('Authentication required. Redirecting to login.');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('API status check failed:', error);
        setApiAvailable(false);
        setApiError("Failed to connect to the API. Showing mock data for demonstration purposes.");
      }
    }
    checkApiStatus();
  }, [navigate]);

  useEffect(() => {
    async function loadBreeds() {
      try {
        setLoading(true);
        if (!apiAvailable) {
          // Use mock breeds if API is not available
          setBreeds(['Golden Retriever', 'German Shepherd', 'Labrador', 'Poodle', 'Bulldog'].sort());
          return;
        }
        
        const breedList = await fetchBreeds();
        setBreeds(breedList.sort((a: string, b: string) => a.localeCompare(b)));
      } catch (error) {
        console.error('Error loading breeds:', error);
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem("dog_finder_auth");
          navigate('/login');
        } else {
          // Use mock breeds if there's an error
          setBreeds(['Golden Retriever', 'German Shepherd', 'Labrador', 'Poodle', 'Bulldog'].sort());
        }
      } finally {
        setLoading(false);
      }
    }
    loadBreeds();
  }, [navigate, apiAvailable]);

  // Define loadDogs outside useEffect so it can be called from elsewhere
  const loadDogs = async () => {
    if (loading) return;
    
    setLoading(true);
    setApiError(null);
    
    try {
      // First check if API is available
      const apiAvailable = await checkApiAvailability();
      setIsApiAvailable(apiAvailable);
      
      if (!apiAvailable) {
        setApiError("The API service appears to be unavailable. Showing mock data for demonstration purposes.");
        // Load mock data
        setDogs([
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
        ]);
        setTotal(3);
        return;
      }
      
      // Prepare search parameters
      const searchParams: SearchParams = {
        breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
        zipCodes: zipCode ? [zipCode] : undefined,
        ageMin: ageMin,
        ageMax: ageMax,
        size: pageSize,
        from: page * pageSize,
        sort: sortOrder,
        sortField: sortField
      };
      
      try {
        console.log("Searching with params:", searchParams);
        const { dogs: dogData, total: totalDogs } = await fetchDogs(searchParams);
        setDogs(dogData);
        setTotal(totalDogs);
      } catch (error) {
        console.error('Error loading dogs:', error);
        
        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem("dog_finder_auth");
          navigate('/login');
        } else {
          // Show a user-friendly error message
          setApiError('Unable to fetch dogs. The API might be temporarily unavailable.');
          // Load mock data as fallback
          setDogs([
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
          ]);
          setTotal(3);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Then in useEffect, just call the function
  useEffect(() => {
    loadDogs();
  }, [selectedBreeds, zipCode, ageMin, ageMax, page, sortOrder, sortField]);

  const toggleFavorite = (dogId: string) => {
    if (isFavorited(dogId)) {
      removeFavorite(dogId);
    } else {
      addFavorite(dogId);
    }
  };

  const generateMatch = async () => {
    if (favorites.length === 0) {
      alert('Please add some favorite dogs first!');
      return;
    }
    
    try {
      setLoading(true);
      
      // Request a match
      const matchId = await fetchMatch(favorites);
      
      if (matchId) {
        // Get the matched dog details
        const matchedDogData = await fetchDogsByIds([matchId]);
        
        if (matchedDogData && matchedDogData.length > 0) {
          // Ensure we're not passing undefined to setMatchedDog
          setMatchedDog(matchedDogData[0] || null);
          setShowMatchModal(true);
        } else {
          setMatchedDog(null);
        }
      }
    } catch (error) {
      console.error('Error generating match:', error);
      alert('Failed to generate a match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (apiError) {
      console.log('API Error:', apiError);
    }
  }, [apiError]);

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      {!apiAvailable && (
        <div className="alert alert-warning" style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ffeeba',
          display: 'flex',
          alignItems: 'center'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 10 }}>
            <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#856404" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>The API service appears to be unavailable. Showing mock data for demonstration purposes.</span>
        </div>
      )}
      
      {apiError && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ffeeba'
        }}>
          <p style={{ margin: 0 }}>{apiError}</p>
          {!isApiAvailable && (
            <button 
              onClick={async () => {
                const available = await checkApiAvailability();
                setIsApiAvailable(available);
                if (available) {
                  setApiError(null);
                  // Reload dogs
                  loadDogs();
                }
              }}
              style={{
                backgroundColor: THEME.primary,
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                marginTop: '8px',
                cursor: 'pointer'
              }}
            >
              Retry Connection
            </button>
          )}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <h1 style={{ margin: 0, color: THEME.text, fontSize: '2rem' }}>Find Your Perfect Dog</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/favorites')}
            style={{
              padding: "10px 20px",
              backgroundColor: THEME.secondary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
            Favorites ({favorites.length})
          </button>
          {favorites.length > 0 && (
            <button
              onClick={generateMatch}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: loading ? '#ccc' : THEME.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 9l-9-7-9 7v11h18V9z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Find Match
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ 
        backgroundColor: THEME.cardBg,
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        boxShadow: `0 4px 12px ${THEME.shadow}`
      }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20
        }}>
          {/* Breed filter */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: THEME.text }}>
              Breed
            </label>
            <div style={{ height: 42 }}>
              <Select
                isMulti
                options={breeds.map(breed => ({ value: breed, label: breed }))}
                value={selectedBreeds.map(breed => ({ value: breed, label: breed }))}
                onChange={(selected) => {
                  setSelectedBreeds(selected ? selected.map(option => option.value) : []);
                  setPage(0); // Reset to first page on filter change
                }}
                placeholder="Select breeds..."
                isDisabled={loading}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: THEME.border,
                    boxShadow: 'none',
                    borderRadius: '6px',
                    minHeight: '42px',
                    height: '42px',
                    '&:hover': {
                      borderColor: THEME.primary,
                    },
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: '2px 8px',
                  }),
                  input: (base) => ({
                    ...base,
                    margin: '0px',
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: '40px',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: `${THEME.primary}20`,
                    borderRadius: '4px',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: THEME.primary,
                    fontWeight: 500,
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: THEME.primary,
                    '&:hover': {
                      backgroundColor: THEME.primary,
                      color: 'white',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected 
                      ? THEME.primary 
                      : state.isFocused 
                        ? `${THEME.primary}10` 
                        : base.backgroundColor,
                    '&:hover': {
                      backgroundColor: state.isSelected 
                        ? THEME.primary 
                        : `${THEME.primary}10`,
                    },
                  }),
                }}
              />
            </div>
          </div>
          
          {/* ZIP Code filter */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: THEME.text }}>
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                setPage(0); // Reset to first page on filter change
              }}
              placeholder="Enter ZIP code"
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: `1px solid ${THEME.border}`,
                height: 42,
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          {/* Age Range filter */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: THEME.text }}>
              Age Range
            </label>
            <div style={{ display: 'flex', gap: 8, height: 42 }}>
              <input
                type="number"
                min="0"
                max="20"
                value={ageMin !== undefined ? ageMin : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  setAgeMin(value);
                  setPage(0); // Reset to first page on filter change
                }}
                placeholder="Min"
                style={{ 
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 6,
                  border: `1px solid ${THEME.border}`,
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  height: '100%'
                }}
              />
              <span style={{ alignSelf: 'center', color: THEME.lightText }}>-</span>
              <input
                type="number"
                min="0"
                max="20"
                value={ageMax !== undefined ? ageMax : ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  setAgeMax(value);
                  setPage(0); // Reset to first page on filter change
                }}
                placeholder="Max"
                style={{ 
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 6,
                  border: `1px solid ${THEME.border}`,
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  height: '100%'
                }}
              />
            </div>
          </div>
          
          {/* Sort By filter */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: THEME.text }}>
              Sort By
            </label>
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setPage(0); // Reset to first page on sort field change
              }}
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: `1px solid ${THEME.border}`,
                height: 42,
                fontSize: '15px',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${THEME.lightText.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="breed">Breed</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="zip_code">Location</option>
            </select>
          </div>
          
          {/* Sort Order filter */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: THEME.text }}>
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as 'asc' | 'desc');
                setPage(0); // Reset to first page on sort change
              }}
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: `1px solid ${THEME.border}`,
                height: 42,
                fontSize: '15px',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${THEME.lightText.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '16px',
                boxSizing: 'border-box'
              }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results grid */}
      {!loading && dogs.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {dogs.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog} 
              isFavorite={isFavorited(dog.id)} 
              onToggleFavorite={toggleFavorite} 
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 32,
          marginBottom: 16
        }}>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0 || loading}
            style={{
              padding: '10px 20px',
              backgroundColor: page === 0 ? '#f5f5f5' : THEME.primary,
              color: page === 0 ? '#999' : 'white',
              border: 'none',
              borderRadius: '8px 0 0 8px',
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              boxShadow: page === 0 ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Previous
          </button>
          
          <div style={{ 
            padding: '10px 20px',
            backgroundColor: THEME.cardBg,
            border: `1px solid ${THEME.border}`,
            borderLeft: 'none',
            borderRight: 'none',
            fontWeight: 500
          }}>
            Page {page + 1} of {totalPages}
          </div>
          
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1 || loading}
            style={{
              padding: '10px 20px',
              backgroundColor: page >= totalPages - 1 ? '#f5f5f5' : THEME.primary,
              color: page >= totalPages - 1 ? '#999' : 'white',
              border: 'none',
              borderRadius: '0 8px 8px 0',
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              boxShadow: page >= totalPages - 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Match Modal */}
      {showMatchModal && matchedDog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: THEME.cardBg,
            borderRadius: 16,
            padding: 32,
            maxWidth: 500,
            width: '90%',
            boxShadow: `0 5px 20px rgba(0, 0, 0, 0.3)`,
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowMatchModal(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: THEME.lightText
              }}
            >
              ×
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ color: THEME.primary, marginBottom: 5 }}>It's a Match!</h2>
              <p style={{ color: THEME.lightText }}>We found the perfect dog for you</p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img 
                src={matchedDog.img} 
                alt={matchedDog.name}
                style={{ 
                  width: '100%', 
                  maxHeight: 300, 
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 16
                }}
              />
              
              <h3 style={{ fontSize: 24, margin: '10px 0' }}>{matchedDog.name}</h3>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                width: '100%',
                margin: '16px 0'
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Breed:</p>
                  <p style={{ margin: '4px 0 0 0', color: THEME.lightText }}>{matchedDog.breed}</p>
                </div>
                
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Age:</p>
                  <p style={{ margin: '4px 0 0 0', color: THEME.lightText }}>{matchedDog.age} years</p>
                </div>
                
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Location:</p>
                  <p style={{ margin: '4px 0 0 0', color: THEME.lightText }}>ZIP: {matchedDog.zip_code}</p>
                </div>
                
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>ID:</p>
                  <p style={{ margin: '4px 0 0 0', color: THEME.lightText }}>{matchedDog.id}</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (!isFavorited(matchedDog.id)) {
                    addFavorite(matchedDog.id);
                  }
                  setShowMatchModal(false);
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: THEME.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginTop: 16
                }}
              >
                {isFavorited(matchedDog.id) ? 'Already in Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
