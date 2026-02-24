"use client";

import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { RefineSnackbarProvider, useNotificationProvider } from "@refinedev/mui";
import { 
  Dashboard, 
  People, 
  ScreenShareOutlined,
  Business,
  PrecisionManufacturing,
  ContentPasteGo,
  Build,
} from "@mui/icons-material";
import { ColorModeContextProvider } from "@contexts/color-mode";

import routerProvider from "@refinedev/nextjs-router";
import { dataProvider } from "../providers/data-provider";

type RefineContextProps = {
  defaultMode?: string;
};

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>
) => {
  return <App {...props} />;
};

type AppProps = {
  defaultMode?: string;
}

const App = (props: React.PropsWithChildren<AppProps>) => {
  const [user, setUser] = React.useState<any>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          setUser({});
        }
      } else {
        setUser({});
      }
    } else {
      setUser({});
    }
  }, []);

  // Função para filtrar recursos baseado no cargo do usuário
  const getResourcesByRole = (userRole?: string) => {
    const allResources = [
      {
        name: "dashboard",
        list: "/dashboard",
        meta: {
          label: "Dashboard",
          icon: <Dashboard />
        }
      },{
        name: "apontamentos",
        list: "/apontamentos",
        show: "/apontamentos/detalhes/:id",
        edit: "/apontamentos/editar/:id",
        create: "/apontamentos/criar",
        meta: {
          label: "Monitoramento",
          icon: <ScreenShareOutlined />
        }
      },
      {
        name: "ordens-producao",
        list: "/ordens-producao",
        show: "/ordens-producao/:id",
        create: "/ordens-producao/criar",
        edit: "/ordens-producao/editar/:id",
        meta: {
          label: "Ordens de Producão",
          icon: <ContentPasteGo />
        }
      },
      {
        name: "maquinas",
        list: "/maquinas",
        show: "/maquinas/detalhes/:id",
        edit: "/maquinas/editar/:id",
        create: "/maquinas/criar",
        meta: {
          label: "Máquinas",
          icon: <PrecisionManufacturing />
        }
      },
      {
        name: "manutencao",
        list: "/manutencoes",
        show: "/manutencao/editar/:id",
        edit: "/manutencao/editar/:id",
        create: "/manutencao/criar",
        meta: {
          label: "Manutenções",
          icon: <Build />
        }
      },
      {
        name: "setores",
        list: "/setores",
        show: "/setores/detalhes/:id",
        edit: "/setores/editar/:id",
        create: "/setores/criar",
        meta: {
          label: "Setores",
          icon: <Business />
        }
      },
      {
        name: "usuarios",
        list: "/usuarios",
        show: "/usuarios/detalhes/:id",
        edit: "/usuarios/editar/:id",
        create: "/usuarios/criar",
        meta: {
          label: "Usuários",
          icon: <People />
        }
      }
    ];

    // Se não houver sessão ou cargo, retorna todos os recursos (será filtrado pela autenticação)
    if (!userRole) {
      return allResources;
    }

    // Filtra recursos baseado no cargo
    switch (userRole.toUpperCase()) {
      case 'OPERADOR':
        // Operador não vê dashboard e usuários
        return allResources.filter(resource => 
          resource.name !== 'dashboard' && resource.name !== 'usuarios' && resource.name !== 'maquinas' && resource.name !== 'setores'
        );
      
      case 'ADMIN':
        // Administrador vê todos os recursos
        return allResources;
      
      case 'GERENTE':
        // Supervisor vê todos exceto usuários (ajuste conforme necessário)
        return allResources.filter(resource => 
          resource.name !== 'usuarios'
        );
      
      default:
        // Para outros cargos, mostra recursos básicos
        return allResources.filter(resource => 
          resource.name !== 'dashboard' && resource.name !== 'usuarios'
        );
    }
  };


  const authProvider = {
    login: async (params: any) => {
      try {
        const response = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        const data = await response.json();
        if (response.ok) {
          if (typeof window !== 'undefined') {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          return {
            success: true,
            redirectTo: "/",
          };
        } else {
          return {
            success: false,
            error: data.message || "Login failed",
          };
        }
      } catch (error) {
        return {
          success: false,
          error: "Network error",
        };
      }
    },

    // Usa o signOut do NextAuth
    logout: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      return {
        success: true,
        redirectTo: "/login",
      };
    },

    onError: async (error: any) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return {
        error,
      };
    },

    // Verifica a autenticação usando a sessão do NextAuth
    check: async () => {
      if (typeof window === 'undefined') {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
      
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    },

    getPermissions: async () => {
      return null;
    },

    // Obtém a identidade do usuário da sessão
    getIdentity: async () => {
      if (typeof window === 'undefined') {
        return null;
      }
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return {
            name: user.nome,
            avatar: user.photoProfile,
          };
        } catch (error) {
          console.error("Error parsing user in getIdentity:", error);
          return null;
        }
      }
      return null;
    },
  };

  const defaultMode = props?.defaultMode;

  return (
    <RefineKbarProvider>
      <RefineSnackbarProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            resources={mounted ? getResourcesByRole(user?.role) : []}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              disableTelemetry: true,
              reactQuery: {
                clientConfig: {
                  defaultOptions: {
                    queries: {
                      staleTime: 30 * 1000, // 30 segundos (reduzido de 5 minutos)
                      gcTime: 5 * 60 * 1000, // 5 minutos em cache (gcTime substituiu cacheTime)
                      retry: 2,
                      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
                      refetchOnWindowFocus: false,
                      refetchOnReconnect: true,
                    },
                  },
                },
              },
            }}
          >
            {props.children}
            <RefineKbar />
          </Refine>
        </ColorModeContextProvider>
      </RefineSnackbarProvider>
    </RefineKbarProvider>
  );
};

export default RefineContext;