import React from 'react';
import { Box, Typography, Slider, Chip, TextField, Autocomplete, Paper } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';

// Props for the Filters component
interface FiltersProps {
  breeds: string[];
  selectedBreeds: string[];
  onSelectedBreedsChange: (breeds: string[]) => void;
  zipCodes: string[];
  onZipChange: (zipCodes: string[]) => void;
  ageRange: [number, number];
  onAgeChange: (ageRange: [number, number]) => void;
}


/**
 * Filters component for filtering dog search results
 * 
 * Provides controls for:
 * - Selecting dog breeds
 * - Setting age range
 * - Entering ZIP codes
 * - Searching with filters
 * - Resetting filters
 */

const Filters: React.FC<FiltersProps> = ({
  breeds,
  selectedBreeds,
  onSelectedBreedsChange,
  zipCodes,
  onZipChange,
  ageRange,
  onAgeChange,
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: '12px 12px 0 0',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        background: 'linear-gradient(to right, rgba(74, 111, 165, 0.05), rgba(255, 157, 110, 0.05))'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          Filter Dogs
        </Typography>
        <Typography variant="caption" sx={{ ml: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          "The perfect dog is out there waiting for you."
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PetsIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="600">
              Breeds
            </Typography>
          </Box>
          <Autocomplete
            multiple
            id="breeds-filter"
            options={breeds}
            value={selectedBreeds}
            onChange={(_, newValue) => onSelectedBreedsChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select breeds"
                size="small"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  sx={{ 
                    backgroundColor: 'primary.light', 
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white'
                    }
                  }}
                />
              ))
            }
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'secondary.main', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="600">
              ZIP Codes
            </Typography>
          </Box>
          <Autocomplete
            multiple
            freeSolo
            id="zip-codes-filter"
            options={[]}
            value={zipCodes}
            onChange={(_, newValue) => onZipChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Enter ZIP codes"
                size="small"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  sx={{ 
                    backgroundColor: 'secondary.light', 
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white'
                    }
                  }}
                />
              ))
            }
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CakeIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="600">
              Age Range: {ageRange[0]} - {ageRange[1]} years
            </Typography>
          </Box>
          <Box sx={{ px: 1 }}>
            <Slider
              value={ageRange}
              onChange={(_, newValue) => onAgeChange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={20}
              sx={{ 
                color: 'success.main',
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  '&::before': {
                    boxShadow: '0 0 0 8px rgba(107, 143, 113, 0.1)'
                  }
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Filters;
