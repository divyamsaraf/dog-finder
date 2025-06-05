import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DogCard, THEME } from '../App';
import { Dog } from '../types';
import { useFavorites } from '../store/useFavorites';
import { fetchDogsByIds } from '../services/api';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite, isFavorited } = useFavorites();
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFavoriteDogs() {
      if (favorites.length === 0) {
        setFavoriteDogs([]);
        return;
      }
      
      try {
        setLoading(true);
        const dogs = await fetchDogsByIds(favorites);
        setFavoriteDogs(dogs);
      } catch (error) {
        console.error('Error loading favorite dogs:', error);
        
        // Check if it's an authentication error
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem("dog_finder_auth");
          navigate('/login');
        } else {
          // Show a user-friendly error message
          alert('Unable to fetch your favorite dogs. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadFavoriteDogs();
  }, [favorites, navigate]);

  const toggleFavorite = (dogId: string) => {
    removeFavorite(dogId);
  };

  return (
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <h1 style={{ margin: 0, color: THEME.text, fontSize: '2rem' }}>Your Favorite Dogs</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: "10px 20px",
            backgroundColor: THEME.primary,
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
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Search
        </button>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 0',
          backgroundColor: THEME.cardBg,
          borderRadius: 12,
          boxShadow: `0 4px 12px ${THEME.shadow}`
        }}>
          <div style={{ marginBottom: "20px" }}>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <path
                fill={THEME.primary}
                d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <p style={{ color: THEME.lightText, fontSize: 16 }}>Loading your favorites...</p>
        </div>
      ) : favoriteDogs.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 0',
          backgroundColor: THEME.cardBg,
          borderRadius: 12,
          boxShadow: `0 4px 12px ${THEME.shadow}`
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 16, opacity: 0.6 }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={THEME.lightText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ fontSize: 16, color: THEME.lightText }}>You haven't added any favorite dogs yet.</p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: "10px 20px",
              backgroundColor: THEME.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: 16,
              fontWeight: 500
            }}
          >
            Find Dogs
          </button>
        </div>
      ) : (
        <div className="dog-grid">
          {favoriteDogs.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog} 
              isFavorite={isFavorited(dog.id)} 
              onToggleFavorite={toggleFavorite} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
