import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import { checkApiStatus } from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

const ApiStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const available = await checkApiStatus();
      setIsAvailable(available);
    } catch (error) {
      setIsAvailable(false);
    } finally {
      setLoading(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const endpoints = [
    { name: 'Authentication', path: API_ENDPOINTS.LOGIN },
    { name: 'Dog Breeds', path: API_ENDPOINTS.BREEDS },
    { name: 'Search Dogs', path: API_ENDPOINTS.SEARCH },
    { name: 'Dog Details', path: API_ENDPOINTS.DOGS },
    { name: 'Match Generation', path: API_ENDPOINTS.MATCH },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Search
        </Button>
        <Typography variant="h4" component="h1">
          API Status
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            API Connection Status
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={checkStatus}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Alert 
              severity={isAvailable ? "success" : "error"}
              icon={isAvailable ? <CheckCircleIcon /> : <ErrorIcon />}
              sx={{ mb: 3 }}
            >
              {isAvailable 
                ? 'API is online and responding to requests' 
                : 'API is currently unavailable'}
            </Alert>
            
            {lastChecked && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Last checked: {lastChecked.toLocaleString()}
              </Typography>
            )}
          </>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>
          API Endpoints
        </Typography>
        
        <List>
          {endpoints.map((endpoint, index) => (
            <React.Fragment key={endpoint.path}>
              <ListItem>
                <ListItemIcon>
                  {isAvailable ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
                </ListItemIcon>
                <ListItemText 
                  primary={endpoint.name} 
                  secondary={endpoint.path} 
                />
              </ListItem>
              {index < endpoints.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Troubleshooting
        </Typography>
        
        <Typography variant="body1" paragraph>
          If you're experiencing issues with the API:
        </Typography>
        
        <List sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item', p: 0, pb: 1 }}>
            <Typography variant="body1">
              Check your internet connection
            </Typography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0, pb: 1 }}>
            <Typography variant="body1">
              Ensure you're logged in (session may have expired)
            </Typography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0, pb: 1 }}>
            <Typography variant="body1">
              Try refreshing the status check above
            </Typography>
          </ListItem>
          <ListItem sx={{ display: 'list-item', p: 0 }}>
            <Typography variant="body1">
              If problems persist, the API service may be down for maintenance
            </Typography>
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default ApiStatusPage;
