import React from 'react';
import { useFavorites } from '../store/useFavorites';
import { Dog } from '../types';

interface FavoriteButtonProps {
  dogId: string;
  dog: Dog;
  isFavorite: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ dogId, dog, isFavorite }) => {
  const { addFavorite, removeFavorite } = useFavorites();

  const toggle = () => {
    isFavorite ? removeFavorite(dogId) : addFavorite(dog);
  };

  return (
    <button onClick={toggle}>
      {isFavorite ? '❤️ Unfavorite' : '🤍 Favorite'}
    </button>
  );
};

export default FavoriteButton;
