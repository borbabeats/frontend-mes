"use client";

import dataProvider from "@refinedev/simple-rest";
import { getSession } from "next-auth/react";
import axios from "axios";
import type { DataProvider } from "@refinedev/core";

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
    // Para outros erros, apenas log e deixar o Refine tratar via notificationProvider
    if (error.response?.data?.message) {
      console.error('Erro da API:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export const customDataProvider: DataProvider = {
  ...dataProvider(API_URL, axiosInstance),
  
  // Mapeamento de recursos para endpoints da API
  getList: async ({ resource, ...rest }: { resource: string; [key: string]: any }) => {
    // Mapeamento explícito de recursos para endpoints
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',  // Frontend 'usuarios' -> Backend 'usuarios'
      'maquinas': 'maquinas',  // Frontend 'maquinas' -> Backend 'maquinas'
      'setores': 'setores',    // Frontend 'setores' -> Backend 'setores'
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    const endpoint = `${API_URL}/${mappedResource}`;
    
    console.log(`🔍 API Call: ${resource} -> ${endpoint}`);
    
    try {
      return await dataProvider(API_URL, axiosInstance).getList({ resource: mappedResource, ...rest });
    } catch (error: any) {
      console.error(`❌ API Error for ${resource}:`, error.response?.status, error.response?.data);
      // Formata o erro para o Refine exibir a mensagem correta
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  getOne: async ({ resource, id, ...rest }: { resource: string; id: any; [key: string]: any }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    console.log(`🔍 API Call: ${resource} -> ${API_URL}/${mappedResource}/${id}`);
    
    try {
      return await dataProvider(API_URL, axiosInstance).getOne({ resource: mappedResource, id, ...rest });
    } catch (error: any) {
      console.error(`❌ API Error for ${resource}:`, error.response?.status, error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  create: async ({ resource, variables, ...rest }: { resource: string; variables: any; [key: string]: any }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    console.log(`🔍 API Call: ${resource} -> ${API_URL}/${mappedResource}`);
    
    try {
      return await dataProvider(API_URL, axiosInstance).create({ resource: mappedResource, variables, ...rest });
    } catch (error: any) {
      console.error(`❌ API Error for ${resource}:`, error.response?.status, error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  update: async ({ resource, id, variables, ...rest }: { resource: string; id: any; variables: any; [key: string]: any }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    console.log(`🔍 API Call: ${resource} -> ${API_URL}/${mappedResource}/${id}`);
    
    try {
      return await dataProvider(API_URL, axiosInstance).update({ resource: mappedResource, id, variables, ...rest });
    } catch (error: any) {
      console.error(`❌ API Error for ${resource}:`, error.response?.status, error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  deleteOne: async ({ resource, id, variables, ...rest }: { resource: string; id: any; variables?: any; [key: string]: any }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    console.log(`🔍 API Call: ${resource} -> ${API_URL}/${mappedResource}/${id}`);
    
    try {
      return await dataProvider(API_URL, axiosInstance).deleteOne({ resource: mappedResource, id, variables, ...rest });
    } catch (error: any) {
      console.error(`❌ API Error for ${resource}:`, error.response?.status, error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
  
  // Métodos customizados usando a propriedade custom
  custom: async (params: any) => {
    if (params.method === 'getProfile') {
      const response = await axiosInstance.get('/users/profile/me');
      return response.data;
    }
    throw new Error('Custom method not found');
  },
};