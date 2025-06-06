import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import PetsIcon from '@mui/icons-material/Pets';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      }}
    >
      <Toolbar>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            flexGrow: 1, 
            cursor: 'pointer' 
          }}
          onClick={() => navigate('/')}
        >
          <PetsIcon sx={{ fontSize: 32 }} />
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Fetch Dog Finder
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit"
            startIcon={<FavoriteIcon />}
            onClick={() => navigate('/favorites')}
            sx={{ 
              borderRadius: '20px',
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)'
              }
            }}
          >
            Favorites
          </Button>
          <Button 
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{ 
              borderRadius: '20px',
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
