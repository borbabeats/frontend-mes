"use client";

import { useEffect, useState } from "react";
import { Backdrop, CircularProgress, Box, Typography } from "@mui/material";
import axios from "axios";

export const GlobalLoading = () => {
  const [open, setOpen] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  useEffect(() => {
    // Intercepta requisições axios para mostrar loading
    
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config: any) => {
        setLoadingCount(prev => {
          const newCount = prev + 1;
          if (newCount === 1) {
            setOpen(true);
          }
          return newCount;
        });
        return config;
      },
      (error: any) => {
        setLoadingCount(prev => {
          const newCount = Math.max(0, prev - 1);
          if (newCount === 0) {
            setOpen(false);
          }
          return newCount;
        });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response: any) => {
        setLoadingCount(prev => {
          const newCount = Math.max(0, prev - 1);
          if (newCount === 0) {
            setOpen(false);
          }
          return newCount;
        });
        return response;
      },
      (error: any) => {
        setLoadingCount(prev => {
          const newCount = Math.max(0, prev - 1);
          if (newCount === 0) {
            setOpen(false);
          }
          return newCount;
        });
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}
      open={open}
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        gap={2}
      >
        <CircularProgress color="primary" size={60} thickness={4} />
        <Typography variant="h6" component="div">
          Processando...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Por favor, aguarde um momento
        </Typography>
      </Box>
    </Backdrop>
  );
};
