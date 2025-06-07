import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import { Dog } from '../../types';
import { getRandomDogQuote } from '../../utils/dogQuotes';

/**
 * Type assertion utility to handle undefined image URLs
 * @param value - The string value to check
 * @param fallback - Fallback value if undefined
 * @returns A guaranteed string value
 */
function assertString(value: string | undefined, fallback: string): string {
  return value !== undefined ? value : fallback;
}


// Props for the DogCard component

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dog: Dog) => void;
}

/**
 * DogCard component displays information about a dog with favorite functionality
 * 
 * Displays dog image, name, breed, age, location, and favorite status
 * Allows toggling favorite status
 */
const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite }) => {
  // Use the assertion function to guarantee a string
  const imageUrl = assertString(dog.img, `https://placedog.net/500/280?id=${dog.id}`);
  

  // Returns a descriptive age category based on dog's age
  const getAgeDescription = (age: number): string => {
    if (age < 1) return 'Puppy';
    if (age < 3) return 'Young';
    if (age < 8) return 'Adult';
    return 'Senior';
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60px',
        height: '60px',
        background: isFavorite ? 'linear-gradient(135deg, transparent 50%, #FF9D6E 50%)' : 'none',
        zIndex: 1,
      }
    }}>
      <CardMedia
        component="img"
        height="220"
        image={imageUrl}
        alt={dog.name}
        sx={{ 
          objectFit: 'cover',
          borderBottom: '4px solid #FF9D6E'
        }}
      />
      
      <Chip 
        label={getAgeDescription(dog.age)}
        size="small"
        sx={{ 
          position: 'absolute', 
          top: 12, 
          left: 12, 
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          {dog.name}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PetsIcon fontSize="small" sx={{ color: '#4A6FA5' }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {dog.breed}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CakeIcon fontSize="small" sx={{ color: '#FF9D6E' }} />
            <Typography variant="body1">
              {dog.age} {dog.age === 1 ? 'year' : 'years'} old
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" sx={{ color: '#6B8F71' }} />
            <Typography variant="body1">
              ZIP: {dog.zip_code}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ 
          display: 'block', 
          mt: 2, 
          fontStyle: 'italic',
          borderTop: '1px dashed rgba(0,0,0,0.1)',
          pt: 1
        }}>
          {getRandomDogQuote()}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="large" 
          color={isFavorite ? "secondary" : "primary"}
          startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={() => onToggleFavorite(dog)}
          variant={isFavorite ? "contained" : "outlined"}
          fullWidth
          sx={{ 
            borderRadius: '25px',
            py: 1,
            fontWeight: 'bold',
            '&:hover': {
              transform: 'scale(1.03)',
              transition: 'transform 0.2s'
            }
          }}
        >
          {isFavorite ? 'Unfavorite' : 'Add to Favorites'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default DogCard;
