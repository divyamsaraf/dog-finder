import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Alert, 
  Button, 
  CircularProgress,
  Pagination,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PetsIcon from '@mui/icons-material/Pets';
import DogCard from '../components/domain/DogCard';
import Filters from '../components/Filters';
import { Dog, SearchParams } from '../types';
import { useFavorites } from '../store/useFavorites';
import { 
  fetchBreeds, 
  searchDogs,
  fetchDogsByIds,
  generateMatch,
  generateRandomMatch
} from '../services/api';
import { getRandomDogQuote } from '../utils/dogQuotes';
import MatchedDogDialog from '../components/domain/MatchedDogDialog';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const theme = useTheme();
  
  // State for dogs and search
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;
  
  // Filter state
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 20]);
  
  // Match dialog state
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Add these state variables
  const [sortField, setSortField] = useState<string>('breed');
  const [sortDirection, setSortDirection] = useState<string>('asc');

  // Add a new state for random match loading
  const [randomMatchLoading, setRandomMatchLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const breedsData = await fetchBreeds();
        setBreeds(breedsData);
        await loadDogs();
      } catch (error: any) {
        // If we get a 401, we're not authenticated
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setApiError('Failed to connect to the API. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [navigate]);

  const loadDogs = async (page = 1) => {
    setLoading(true);
    setApiError(null);
    
    try {
      const searchParams: SearchParams = {
        breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
        zipCodes: zipCodes.length > 0 ? zipCodes : undefined,
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        size: pageSize,
        from: (page - 1) * pageSize,
        sort: sortDirection,
        sortField: sortField
      };
      
      const searchResult = await searchDogs(searchParams);
      const dogsData = await fetchDogsByIds(searchResult.resultIds);
      
      setDogs(dogsData);
      setTotalPages(Math.ceil(searchResult.total / pageSize));
      setCurrentPage(page);
    } catch (error) {
      setApiError('Failed to fetch dogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadDogs(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    loadDogs(page);
  };

  const handleToggleFavorite = (dog: Dog) => {
    const isFavorite = favorites.some(fav => fav.id === dog.id);
    if (isFavorite) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      setApiError('Please add some dogs to your favorites first');
      return;
    }
    
    setMatchLoading(true);
    setMatchDialogOpen(true);
    
    try {
      const matchId = await generateMatch(favorites.map(dog => dog.id));
      const matchedDogs = await fetchDogsByIds([matchId]);
      
      // Create a safe version of the dog that's definitely not undefined
      let dogToSet: Dog | null = null;
      
      if (Array.isArray(matchedDogs) && matchedDogs.length > 0) {
        const firstDog = matchedDogs[0];
        if (firstDog) {
          dogToSet = firstDog;
        }
      }
      
      // Now we're setting either a valid Dog or null
      setMatchedDog(dogToSet);
    } catch (error) {
      setApiError('Failed to generate a match. Please try again.');
      setMatchDialogOpen(false);
    } finally {
      setMatchLoading(false);
    }
  };

  // Add a function to handle random match generation
  const handleRandomMatch = async () => {
    setRandomMatchLoading(true);
    setMatchDialogOpen(true);
    
    try {
      // Get a random dog ID using our custom function
      const randomDogId = await generateRandomMatch();
      
      // Fetch the dog details
      const randomDogs = await fetchDogsByIds([randomDogId]);
      
      if (Array.isArray(randomDogs) && randomDogs.length > 0) {
        const firstDog = randomDogs[0];
        if (firstDog) {
          setMatchedDog(firstDog);
        } else {
          setApiError('Failed to retrieve dog details. Please try again.');
          setMatchDialogOpen(false);
        }
      } else {
        setApiError('Failed to find a random match. Please try again.');
        setMatchDialogOpen(false);
      }
    } catch (error) {
      console.error('Random match error:', error);
      setApiError('Failed to generate a random match. Please try again.');
      setMatchDialogOpen(false);
    } finally {
      setRandomMatchLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: theme.palette.primary.main,
            fontWeight: 700
          }}
        >
          <PetsIcon sx={{ fontSize: 32 }} />
          Find Your Perfect Dog
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontStyle: 'italic',
            maxWidth: '400px',
            textAlign: { xs: 'left', md: 'center' },
            borderLeft: { xs: 'none', md: `4px solid ${theme.palette.primary.light}` },
            pl: { xs: 0, md: 2 }
          }}
        >
          {getRandomDogQuote()}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 }, alignSelf: { xs: 'flex-end', md: 'center' } }}>
          <Button
            variant="outlined"
            startIcon={<FavoriteIcon />}
            onClick={() => navigate('/favorites')}
            sx={{ borderRadius: 25 }}
          >
            View Favorites ({favorites.length})
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
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
              startIcon={<FavoriteIcon />}
              onClick={handleGenerateMatch}
              disabled={favorites.length === 0 || matchLoading}
              sx={{ borderRadius: 25 }}
            >
              {matchLoading ? <CircularProgress size={24} color="inherit" /> : 'Match from Favorites'}
            </Button>
          </Box>
        </Box>
      </Box>
      
      {apiError && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
        >
          {apiError}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Filters
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          onSelectedBreedsChange={setSelectedBreeds}
          zipCodes={zipCodes}
          onZipChange={setZipCodes}
          ageRange={ageRange}
          onAgeChange={setAgeRange}
        />
        
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-field-label">Sort By</InputLabel>
              <Select
                labelId="sort-field-label"
                id="sort-field"
                value={sortField}
                label="Sort By"
                onChange={(e) => setSortField(e.target.value)}
              >
                <MenuItem value="breed">Breed</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="age">Age</MenuItem>
                <MenuItem value="zip_code">Location</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth size="small">
              <InputLabel id="sort-direction-label">Direction</InputLabel>
              <Select
                labelId="sort-direction-label"
                id="sort-direction"
                value={sortDirection}
                label="Direction"
                onChange={(e) => setSortDirection(e.target.value)}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {dogs.length > 0 ? (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 3,
                mt: 3
              }}
            >
              {dogs.map(dog => (
                <Box key={dog.id}>
                  <DogCard 
                    dog={dog}
                    isFavorite={favorites.some(fav => fav.id === dog.id)}
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
              <Typography variant="h6">No dogs found matching your criteria</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters or search for different breeds
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                {getRandomDogQuote()}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {getRandomDogQuote()}
            </Typography>
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
      
      <MatchedDogDialog
        open={matchDialogOpen}
        onClose={() => setMatchDialogOpen(false)}
        matchedDog={matchedDog}
        isFavorite={matchedDog ? favorites.some(fav => fav.id === matchedDog.id) : false}
        onToggleFavorite={handleToggleFavorite}
        matchType={randomMatchLoading ? "random" : "favorites"}
      />
      
      {/* Floating action button for mobile */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16, display: { md: 'none' } }}
        onClick={() => navigate('/favorites')}
      >
        <FavoriteIcon />
      </Fab>
    </Container>
  );
};
