import React from 'react';
import { Card as MuiCard, CardContent, Typography } from '@mui/material';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  sx?: object;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '', 
  sx = {} 
}) => {
  return (
    <MuiCard className={className} sx={sx}>
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
