"use client";

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
      window.location.href = '/login';
    }
    if (error.response?.data?.message) {
      console.error('Erro da API:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);

// Data provider customizado para padrão RESTful
export const customDataProvider: DataProvider = {
  getApiUrl: () => API_URL,
  
  getList: async ({ 
    resource, 
    pagination, 
    sorters = [], 
    filters = [], 
    meta 
  }) => {
    const params: Record<string, any> = {};

    // Paginação: ?page=1&limit=20
    if (pagination && pagination.mode !== "off") {
      params.page = (pagination as any).current ?? 1;
      params.limit = (pagination as any).pageSize ?? 10;
    }

    // Ordenação: ?sortBy=campo&sortOrder=ASC|DESC
    if (sorters.length > 0) {
      const firstSorter = sorters[0];
      params.sortBy = firstSorter.field;
      params.sortOrder = firstSorter.order.toUpperCase();
    }

    // Filtros: ?campo=valor&filter=termo
    filters.forEach((filter) => {
      switch (filter.operator) {
        case 'eq':
          // Filtros específicos: ?maquinaId=5&opId=15
          params[filter.field] = filter.value;
          break;
        case 'contains':
          // Busca geral: ?filter=Prensa
          if (filter.field === 'name' || filter.field === 'nome' || filter.field === 'search') {
            params.filter = filter.value.replace(/%/g, '');
          } else {
            // Para contains em campos específicos
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

    // Adicionar parâmetros adicionais do meta (apenas os permitidos)
    if (meta) {
      const allowedParams = ['search', 'q', 'termo', 'busca', 'setorId', 'maquinaId', 'usuarioId', 'status', 'situacao', 'estado', 'dataInicio', 'dataFim', 'periodo', 'tipo', 'category', 'categoria', 'ativo', 'enabled', 'visivel'];
      
      allowedParams.forEach(param => {
        if (meta[param] !== undefined && meta[param] !== null) {
          params[param] = meta[param];
        }
      });
    }

    // Mapeamento de recursos para endpoints
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
      'apontamentos': 'apontamentos',
      'ordens-producao': 'ordens-producao',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${mappedResource}`;

    try {
      const response = await axiosInstance.get(url, { params });
      
      // Extrair dados da resposta no formato esperado pelo Refine
      let responseData = Array.isArray(response.data) ? response.data : response.data.data ?? response.data.items ?? [];
      let total = response.data.total ?? response.data.totalItems ?? response.data.count ?? responseData.length;
      
      // Se tiver headers com total count
      if (response.headers['x-total-count']) {
        total = Number(response.headers['x-total-count']);
      }
      
      return {
        data: responseData,
        total: total,
      };
    } catch (error: any) {
      // Tratamento de erro
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        throw new Error(errorMessages);
      }
      const statusMessages: Record<number, string> = {
        400: 'Requisição inválida',
        401: 'Não autorizado',
        403: 'Acesso negado',
        404: 'Recurso não encontrado',
        422: 'Dados inválidos',
        429: 'Muitas requisições',
        500: 'Erro interno do servidor',
      };
      const message = statusMessages[error.response?.status] || 'Erro desconhecido';
      throw new Error(message);
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
      'apontamentos': 'apontamentos',
      'ordens-producao': 'ordens-producao',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${mappedResource}/${id}`;
    
    try {
      const response = await axiosInstance.get(url);
      return { data: response.data };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao buscar registro');
    }
  },

  create: async ({ resource, variables, meta }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
      'apontamentos': 'apontamentos',
      'ordens-producao': 'ordens-producao',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${mappedResource}`;
    
    try {
      const response = await axiosInstance.post(url, variables);
      return { data: response.data };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar registro');
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
      'apontamentos': 'apontamentos',
      'ordens-producao': 'ordens-producao',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${mappedResource}/${id}`;
    
    try {
      const response = await axiosInstance.patch(url, variables);
      return { data: response.data };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao atualizar registro');
    }
  },

  deleteOne: async ({ resource, id, meta }) => {
    const resourceMapping: Record<string, string> = {
      'usuarios': 'usuarios',
      'maquinas': 'maquinas',
      'setores': 'setores',
      'apontamentos': 'apontamentos',
      'ordens-producao': 'ordens-producao',
    };
    
    const mappedResource = resourceMapping[resource] || resource;
    const url = `${API_URL}/${mappedResource}/${id}`;
    
    try {
      await axiosInstance.delete(url);
      return { data: {} as any };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao excluir registro');
    }
  },

  // Métodos customizados se necessário
  custom: async ({ url, method, payload, query, headers, meta }) => {
    try {
      const response = await axiosInstance({
        url: `${API_URL}${url}`,
        method,
        data: payload,
        params: query,
        headers,
      });
      
      return { data: response.data };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro na requisição customizada');
    }
  },
};

// Exportações para uso externo
export { axiosInstance, API_URL };