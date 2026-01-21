"use client";

import dataProvider from "@refinedev/simple-rest";
import { getSession } from "next-auth/react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Adiciona o token de autenticação a todas as requisições
axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.accessToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Adiciona tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redireciona para a página de login se não autenticado
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const customDataProvider = {
  ...dataProvider(API_URL, axiosInstance),
  // Rota customizada para perfil do usuário
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile/me');
    return response.data;
  },
};