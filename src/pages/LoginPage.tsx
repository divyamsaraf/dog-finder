import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import PetsIcon from '@mui/icons-material/Pets';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Please enter both name and email');
      return;
    }

    try {
      const success = await login(name, email);
      if (success) {
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          color: 'white'
        }}>
          <PetsIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center">
          Welcome to Fetch Dog Finder
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
          Find your perfect canine companion
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center', fontStyle: 'italic' }}>
          "Dogs are not our whole life, but they make our lives whole." — Roger Caras
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 25, fontWeight: 'bold' }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 3, 
          opacity: 0.5 
        }}>
          <PetsIcon sx={{ fontSize: 16, transform: 'rotate(-30deg)', mr: 1 }} />
          <PetsIcon sx={{ fontSize: 16, mr: 1 }} />
          <PetsIcon sx={{ fontSize: 16, transform: 'rotate(30deg)' }} />
        </Box>
      </Box>
    </Container>
  );
};
