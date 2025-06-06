import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography, 
  Box, 
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Dog } from '../../types';
import { getRandomDogQuote } from '../../utils/dogQuotes';

interface MatchedDogDialogProps {
  open: boolean;
  onClose: () => void;
  matchedDog: Dog | null;
  isFavorite: boolean;
  onToggleFavorite: (dog: Dog) => void;
  matchType?: "random" | "favorites";
}

const MatchedDogDialog: React.FC<MatchedDogDialogProps> = ({ 
  open, 
  onClose, 
  matchedDog, 
  isFavorite, 
  onToggleFavorite,
  matchType = "favorites"
}) => {
  const theme = useTheme();

  if (!matchedDog) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: matchType === "random" ? theme.palette.info.main : theme.palette.secondary.main, 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PetsIcon /> 
          <Typography variant="h6">
            {matchType === "random" ? "Your Random Match!" : "Your Perfect Match!"}
          </Typography>
        </Box>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
          {/* Left side - Image */}
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            position: 'relative',
            height: { xs: '300px', md: '100%' }
          }}>
            <img 
              src={matchedDog.img || `https://placedog.net/500/500?id=${matchedDog.id}`}
              alt={matchedDog.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <Box sx={{ 
              position: 'absolute', 
              top: 16, 
              left: 16, 
              bgcolor: 'rgba(0,0,0,0.6)', 
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <PetsIcon fontSize="small" />
              <Typography variant="body2">{matchedDog.breed}</Typography>
            </Box>
          </Box>
          
          {/* Right side - Details */}
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {matchedDog.name}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={matchedDog.breed} 
                color="primary" 
                size="medium"
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                icon={<CakeIcon />} 
                label={`${matchedDog.age} ${matchedDog.age === 1 ? 'year' : 'years'} old`} 
                color="secondary"
                size="medium" 
              />
              <Chip 
                icon={<LocationOnIcon />}
                label={matchedDog.zip_code}
                variant="outlined"
                size="medium"
              />
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: theme.palette.secondary.main,
                mb: 1
              }}>
                <InfoIcon fontSize="small" />
                Why {matchedDog.name} is your perfect match
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                {matchType === "random" 
                  ? `Meet ${matchedDog.name}! This adorable ${matchedDog.breed} could be your perfect companion. Take a moment to get to know them and see if you'd like to add them to your favorites.`
                  : `Based on your favorites, our algorithm has determined that ${matchedDog.name} would be the perfect companion for you! ${matchedDog.name}'s breed, age, and temperament align perfectly with your preferences.`
                }
              </Typography>
              
              <Box sx={{ 
                bgcolor: 'rgba(255, 157, 110, 0.1)', 
                borderRadius: 2, 
                p: 2,
                mb: 2,
                border: '1px dashed rgba(255, 157, 110, 0.3)'
              }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: theme.palette.secondary.main }}>
                  {getRandomDogQuote()}
                </Typography>
              </Box>
            </Box>
            
            {matchType === "favorites" && (
              <Box sx={{ 
                bgcolor: theme.palette.grey[50], 
                p: 2, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.grey[200]}`
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Compatibility Details:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Breed Match:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                      Excellent
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Age Compatibility:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                      Perfect
                    </Typography>
                  </Box>
                  {/* Removed the Overall Match: 98% section */}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: theme.palette.grey[50] }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<FavoriteIcon />}
          onClick={() => {
            if (matchedDog) {
              onToggleFavorite(matchedDog);
            }
            onClose();
          }}
          sx={{ 
            px: 3,
            bgcolor: isFavorite
              ? theme.palette.grey[400] 
              : theme.palette.secondary.main,
            '&:hover': {
              bgcolor: isFavorite
                ? theme.palette.grey[500] 
                : theme.palette.secondary.dark,
            }
          }}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchedDogDialog;
