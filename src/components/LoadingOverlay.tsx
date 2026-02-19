'use client';

import { CircularProgress, Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  subMessage?: string;
}

export const LoadingOverlay = ({ 
  isLoading, 
  message = "Carregando...", 
  subMessage = "Processando solicitação" 
}: LoadingOverlayProps) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // Mostrar loading imediatamente se já estiver carregando
      setShowLoading(true);
    } else {
      // Manter loading visível por pelo menos 300ms para evitar flicker
      timeoutId = setTimeout(() => {
        setShowLoading(false);
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  if (!showLoading) return null;

  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)',
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2,
        padding: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" textAlign="center">
          {message}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {subMessage}
        </Typography>
      </Box>
    </Box>
  );
};
