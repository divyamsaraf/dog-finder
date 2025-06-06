import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  disabled = false,
  className,
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      startIcon={isLoading ? undefined : startIcon}
      endIcon={isLoading ? undefined : endIcon}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      className={className}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </MuiButton>
  );
};

export default Button;
