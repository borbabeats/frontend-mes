"use client";

import axios from "axios";
import type { DataProvider } from "@refinedev/core";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função para normalizar datas para formato esperado pela API: YYYY-MM-DDTHH:MM
const normalizeDate = (dateValue: any): string | null => {
  if (!dateValue) return null;
  
  let date: Date;
  
  // Se já for string, tentar converter
  if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'number') {
    date = new Date(dateValue);
  } else {
    return null;
  }
  
  if (isNaN(date.getTime())) return null;
  
  // Formatar como YYYY-MM-DDTHH:MM (ex: 2026-02-19T22:51)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Função para normalizar todas as datas em um objeto
const normalizeDatesInObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const dateFields = [
    'dataInicioPlanejado',
    'dataFimPlanejado', 
    'dataInicioReal',
    'dataFimReal',
    'createdAt',
    'updatedAt',
    'deletedAt'
  ];
  
  const normalized = { ...obj };
  
  dateFields.forEach(field => {
    if (field in normalized) {
      normalized[field] = normalizeDate(normalized[field]);
    }
  });
  
  return normalized;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Adiciona o token de autenticação a todas as requisições
axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
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
      window.location.href = '/login';
    }
    if (error.response?.data?.message) {
      console.error('Erro da API:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);

// Data provider customizado para padrão RESTful
export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL || '',
  
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params: any = {};
    
    // Paginação
    if (pagination && 'current' in pagination && 'pageSize' in pagination) {
      params.page = (pagination as any).current;
      params.limit = (pagination as any).pageSize;
    }

    // Ordenação
    if (sorters && sorters.length > 0) {
      const firstSorter = sorters[0];
      params.sortBy = firstSorter.field;
      params.sortOrder = firstSorter.order.toUpperCase();
    }

    // Filtros
    if (filters) {
      filters.forEach((filter) => {
        switch (filter.operator) {
          case 'eq':
            params[filter.field] = filter.value;
            break;
          case 'contains':
            if (filter.field === 'name' || filter.field === 'nome' || filter.field === 'search') {
              params.filter = filter.value.replace(/%/g, '');
            } else {
              params[filter.field] = filter.value.replace(/%/g, '');
            }
            break;
          case 'ne':
            params[`${filter.field}_ne`] = filter.value;
            break;
          case 'gt':
            params[`${filter.field}_gt`] = filter.value;
            break;
          case 'gte':
            params[`${filter.field}_gte`] = filter.value;
            break;
          case 'lt':
            params[`${filter.field}_lt`] = filter.value;
            break;
          case 'lte':
            params[`${filter.field}_lte`] = filter.value;
            break;
          case 'in':
            params[`${filter.field}_in`] = Array.isArray(filter.value) ? filter.value.join(',') : filter.value;
            break;
        }
      });
    }

    // Meta parameters
    if (meta) {
      const allowedParams = ['search', 'q', 'termo', 'busca', 'setorId', 'maquinaId', 'usuarioId', 'status', 'situacao', 'estado', 'dataInicio', 'dataFim', 'periodo', 'tipo', 'category', 'categoria', 'ativo', 'enabled', 'visivel'];
      
      allowedParams.forEach(param => {
        if (meta[param] !== undefined && meta[param] !== null) {
          params[param] = meta[param];
        }
      });
    }

    const response = await axiosInstance.get(`/${resource}`, { params });
    const data = response.data;
  
    return {
      data: data.data || data,
      total: data.total || (Array.isArray(data) ? data.length : 0),
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await axiosInstance.get(`/${resource}/${id}`);
    return { data: response.data };
  },

  create: async ({ resource, variables }) => {
    // Normalizar datas para formato ISO-8601
    const normalizedVariables = normalizeDatesInObject(variables);

    const response = await axiosInstance.post(`/${resource}`, normalizedVariables);
    return { data: response.data };
  },

  update: async ({ resource, id, variables }) => {
    // Normalizar datas para formato ISO-8601
    const normalizedVariables = normalizeDatesInObject(variables);

    const response = await axiosInstance.put(`/${resource}/${id}`, normalizedVariables);
    return { data: response.data };
  },

  deleteOne: async ({ resource, id }) => {
    await axiosInstance.delete(`/${resource}/${id}`);
    return { data: { id } as any };
  },
};

// Exportações para uso externo
export { axiosInstance, API_URL };