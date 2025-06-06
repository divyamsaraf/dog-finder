import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Alert, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DogCard from '../components/domain/DogCard';
import { useFavorites } from '../store/useFavorites';
import { generateMatch, fetchDogsByIds, generateRandomMatch } from '../services/api';
import { Dog } from '../types';
import { useTheme } from '@mui/material/styles';
import MatchedDogDialog from '../components/domain/MatchedDogDialog';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites, addFavorite } = useFavorites();
  const theme = useTheme();
  
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [randomMatchLoading, setRandomMatchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const handleToggleFavorite = (dog: Dog) => {
    removeFavorite(dog.id);
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      setError('Please add some dogs to your favorites first');
      return;
    }
    
    setMatchLoading(true);
    setError(null);
    
    try {
      const matchId = await generateMatch(favorites.map(dog => dog.id));
      const matchedDogs = await fetchDogsByIds([matchId]);
      if (matchedDogs.length > 0) {
        setMatchedDog(matchedDogs[0] || null);
        setMatchDialogOpen(true);
      }
    } catch (error) {
      setError('Failed to generate a match. Please try again.');
    } finally {
      setMatchLoading(false);
    }
  };

  const handleRandomMatch = async () => {
    setRandomMatchLoading(true);
    setError(null);
    
    try {
      // Get a random dog ID using our custom function
      const randomDogId = await generateRandomMatch();
      
      // Fetch the dog details
      const randomDogs = await fetchDogsByIds([randomDogId]);
      
      if (Array.isArray(randomDogs) && randomDogs.length > 0) {
        const firstDog = randomDogs[0];
        if (firstDog) {
          setMatchedDog(firstDog);
          setMatchDialogOpen(true);
        } else {
          setError('Failed to retrieve dog details. Please try again.');
        }
      } else {
        setError('Failed to find a random match. Please try again.');
      }
    } catch (error) {
      console.error('Random match error:', error);
      setError('Failed to generate a random match. Please try again.');
    } finally {
      setRandomMatchLoading(false);
    }
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setClearConfirmOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: theme.palette.secondary.main,
            fontWeight: 700
          }}
        >
          <FavoriteIcon sx={{ fontSize: 32 }} />
          Your Favorite Dogs
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {favorites.length > 0 && (
            <Tooltip title="Clear all favorites">
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setClearConfirmOpen(true)}
                sx={{ borderRadius: 25 }}
              >
                Clear All
              </Button>
            </Tooltip>
          )}
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShuffleIcon />}
            onClick={handleRandomMatch}
            disabled={randomMatchLoading}
            sx={{ 
              borderRadius: 25,
              bgcolor: theme.palette.info.main,
              '&:hover': {
                bgcolor: theme.palette.info.dark,
              }
            }}
          >
            {randomMatchLoading ? <CircularProgress size={24} color="inherit" /> : 'Random Match'}
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ShuffleIcon />}
            onClick={handleGenerateMatch}
            disabled={favorites.length === 0 || matchLoading}
            sx={{ borderRadius: 25 }}
          >
            {matchLoading ? <CircularProgress size={24} color="inherit" /> : 'Match from Favorites'}
          </Button>
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
        "Until one has loved an animal, a part of one's soul remains unawakened." — Anatole France
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {favorites.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1.5 }}>
          {favorites.map(dog => (
            <Box 
              key={dog.id} 
              sx={{ 
                width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                padding: 1.5 
              }}
            >
              <DogCard 
                dog={dog}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          my: 8,
          p: 4,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 157, 110, 0.05)',
          border: '1px dashed rgba(255, 157, 110, 0.3)'
        }}>
          <PetsIcon sx={{ fontSize: 60, color: 'rgba(255, 157, 110, 0.5)', mb: 2 }} />
          <Typography variant="h6">No favorites yet</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Start adding dogs to your favorites from the search page
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            "Dogs do speak, but only to those who know how to listen." — Orhan Pamuk
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 3, borderRadius: 25 }}
          >
            Search Dogs
          </Button>
        </Box>
      )}
      
      {/* Match Dialog - Enhanced UI */}
      <MatchedDogDialog
        open={matchDialogOpen}
        onClose={() => setMatchDialogOpen(false)}
        matchedDog={matchedDog}
        isFavorite={matchedDog ? favorites.some(f => f.id === matchedDog.id) : false}
        onToggleFavorite={(dog) => {
          if (!favorites.some(f => f.id === dog.id)) {
            addFavorite(dog);
          }
        }}
        matchType={randomMatchLoading ? "random" : "favorites"}
      />
      
      {/* Clear Favorites Confirmation Dialog */}
      <Dialog
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
      >
        <DialogTitle>Clear All Favorites?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all {favorites.length} dogs from your favorites? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleClearFavorites} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Add a default export
export default FavoritesPage;
