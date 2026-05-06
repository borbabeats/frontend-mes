"use client";

import axios from "axios";
import { z } from "zod";

// Schema para validação do usuário
const UserSchema = z.object({
  id: z.number().transform(String), // API retorna number, mas queremos string
  nome: z.string(), // API retorna 'nome' não 'name'
  email: z.string(),
  cargo: z.string(), // API retorna 'cargo' não 'role'
  photoProfile: z.string().nullable().optional(), // API retorna 'photoProfile' não 'image'
  setorId: z.number().nullable().optional(),
}).transform((data) => ({
  ...data,
  name: data.nome, // Mapear nome para name para compatibilidade
  role: data.cargo, // Mapear cargo para role para compatibilidade
  image: data.photoProfile, // Mapear photoProfile para image
}));

// Schema para resposta de login
const LoginResponseSchema = z.object({
  user: UserSchema,
  access_token: z.string(),
});

// Tipos
export type User = z.infer<typeof UserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Interface para gerenciamento de auth
interface AuthClient {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}

// Classe para gerenciar autenticação client-side
class AuthManager implements AuthClient {
  private static instance: AuthManager;
  private _user: User | null = null;
  private _token: string | null = null;
  private _isLoading: boolean = false;
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";
  private readonly API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  get user(): User | null {
    return this._user;
  }

  get token(): string | null {
    return this._token;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  private loadFromStorage(): void {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);
        
        if (token && userStr) {
          this._token = token;
          const userData = JSON.parse(userStr);
          const parsedUser = UserSchema.safeParse(userData);
          
          if (parsedUser.success) {
            this._user = parsedUser.data;
          } else {
            this.clearStorage();
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do storage:", error);
        this.clearStorage();
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      try {
        if (this._token && this._user) {
          localStorage.setItem(this.TOKEN_KEY, this._token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(this._user));
        }
      } catch (error) {
        console.error("Erro ao salvar dados no storage:", error);
      }
    }
  }

  private clearStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._token = null;
    this._user = null;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    this._isLoading = true;

    try {
      const response = await axios.post(`${this.API_URL}/auth/login`, {
        email,
        senha: password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const validatedData = LoginResponseSchema.parse(response.data);
      
      this._user = validatedData.user;
      this._token = validatedData.access_token;
      this.saveToStorage();

      return validatedData;
    } catch (error: any) {
      console.error('Erro no login:', error);
      this.clearStorage();
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.response?.status === 401) {
        throw new Error("Credenciais inválidas");
      }
      
      throw new Error("Falha no login. Tente novamente.");
    } finally {
      this._isLoading = false;
    }
  }

  logout(): void {
    this.clearStorage();
    window.location.href = "/login";
  }

  async checkAuth(): Promise<boolean> {
    if (!this._token || !this._user) {
      return false;
    }

    try {
      // Verificar se o token ainda é válido fazendo uma requisição simples
      const response = await axios.get(`${this.API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${this._token}`,
        },
      });

      const userData = UserSchema.safeParse(response.data);
      if (userData.success) {
        this._user = userData.data;
        this.saveToStorage();
        return true;
      } else {
        this.clearStorage();
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      this.clearStorage();
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    // Implementar refresh token se a API suportar
    // Por enquanto, apenas verifica se o token atual é válido
    return this.checkAuth();
  }
}

// Exportar instância singleton
export const authClient = AuthManager.getInstance();

// Hook para React
export function useAuth() {
  const [user, setUser] = useState<User | null>(authClient.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateUser = () => setUser(authClient.user);
    updateUser();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(authClient.user);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authClient.login(email, password);
      setUser(authClient.user);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authClient.logout();
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const isValid = await authClient.checkAuth();
      setUser(authClient.user);
      return isValid;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    token: authClient.token,
    isLoading: isLoading || authClient.isLoading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
}

// Imports necessários
import { useState, useEffect } from "react";
