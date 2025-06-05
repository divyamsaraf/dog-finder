import React from 'react';
import { useFavorites } from '../store/useFavorites';
import './DogCard.css'; // Import the CSS

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogCardProps {
  dog: Dog;
}

export const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  const toggleFavorite = () => {
    if (isFavorited(dog.id)) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog.id);
    }
  };

  return (
    <div className="dog-card">
      <img
        src={dog.img}
        alt={dog.name}
        className="dog-card-image"
      />
      <h3>{dog.name}</h3>
      <p>Breed: {dog.breed}</p>
      <p>Age: {dog.age}</p>
      <p>ZIP: {dog.zip_code}</p>
      <button
        onClick={toggleFavorite}
        className={`favorite-button ${isFavorited(dog.id) ? 'favorited' : ''}`}
        title={isFavorited(dog.id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorited(dog.id) ? '★' : '☆'}
      </button>
    </div>
  );
};
