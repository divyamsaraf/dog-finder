import React from 'react';
import { Dog } from '../../types';
import { THEME } from '../../styles/theme';
import { useFavorites } from '../../store/useFavorites';

interface MatchModalProps {
  matchedDog: Dog;
  onClose: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ matchedDog, onClose }) => {
  const { addFavorite, isFavorite } = useFavorites();

  return (
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
          onClick={onClose}
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
        
        {/* Rest of the modal content */}
        
        <button
          onClick={() => {
            if (!isFavorite(matchedDog.id)) {
              addFavorite(matchedDog);
            }
          }}
          disabled={isFavorite(matchedDog.id)}
          style={{
            flex: 1,
            padding: "12px 24px",
            backgroundColor: isFavorite(matchedDog.id) ? '#e0e0e0' : THEME.accent,
            color: isFavorite(matchedDog.id) ? '#666' : 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isFavorite(matchedDog.id) ? 'default' : 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          {isFavorite(matchedDog.id) ? (
            <>
              <span style={{ fontSize: '1.2em' }}>❤️</span>
              Already in Favorites
            </>
          ) : (
            <>
              <span style={{ fontSize: '1.2em' }}>🤍</span>
              Add to Favorites
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MatchModal;
