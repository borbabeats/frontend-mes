import axios from 'axios';
import { authClient } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  let token = authClient.token;
  
  // Fallback: tentar obter diretamente do localStorage se authClient não tiver token
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token');
    console.log('[MES SERVICE] Token obtido do localStorage (fallback):', token ? 'SIM' : 'NÃO');
  }
  
  // Debug: verificar se o token está sendo encontrado
  console.log('[MES SERVICE] Token obtido do authClient:', authClient.token ? 'SIM' : 'NÃO');
  console.log('[MES SERVICE] URL da requisição:', config.url);
  console.log('[MES SERVICE] Token adicionado ao header:', token ? 'SIM' : 'NÃO');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
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

// Helper para padronizar resposta
function handleResponse<T>(response: any): ApiResponse<T> {
  // Se já vier no formato ApiResponse
  if (response.data !== undefined && typeof response.data === 'object' && 'data' in response.data) {
    return response.data;
  }
  
  // Se for resposta direta (caso da maioria dos endpoints)
  return {
    data: response.data,
    message: 'Operação realizada com sucesso'
  };
}

// Tipos específicos baseados no backend
export interface AuthResponse {
  access_token: string;
  user: any;
}

export interface DeleteResponse {
  message: string;
  id: number;
  codigo?: string;
  nome?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
  isLoading?: boolean;
}

// Serviços atualizados
export const OrdemProducaoService = {
  async criar(dados: any): Promise<ApiResponse<any>> {
    const response = await api.post(`/ordens-producao`, dados);
    return handleResponse(response);
  },

  async alterarStatus(id: number | string, novoStatus: string, motivo: string): Promise<ApiResponse<any>> {
    const response = await api.patch(`/ordens-producao/${id}/status`, {
      novoStatus,
      motivo: motivo.trim()
    });
    return handleResponse(response);
  },

  async atualizarProducao(id: number | string, quantidade: number, defeitos: number): Promise<ApiResponse<any>> {
    const response = await api.post(`/ordens-producao/${id}/atualizar-producao`, {
      quantidade,
      defeitos
    });
    return handleResponse(response);
  },

  async listar(filtros?: any): Promise<ApiResponse<PaginatedResult<any>>> {
    const response = await api.get(`/ordens-producao`, { params: filtros });
    return handleResponse(response);
  },

  async buscarPorId(id: number | string): Promise<ApiResponse<any>> {
    const response = await api.get(`/ordens-producao/${id}`);
    return handleResponse(response);
  }
};

export const ApontamentoService = {
  async finalizar(id: number | string, quantidadeProduzida: number, quantidadeDefeito: number): Promise<ApiResponse<any>> {
    const response = await api.post(`/apontamentos/${id}/finalize`, {
      quantidadeProduzida,
      quantidadeDefeito
    });
    return handleResponse(response);
  },

  async listar(filtros?: any): Promise<ApiResponse<PaginatedResult<any>>> {
    const response = await api.get(`/apontamentos`, { params: filtros });
    return handleResponse(response);
  }
};

export { api };

export const MESService = {
  ordemProducao: OrdemProducaoService,
  apontamento: ApontamentoService,
  api
};

export default MESService;
