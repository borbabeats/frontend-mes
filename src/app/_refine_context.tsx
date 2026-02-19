"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { RefineSnackbarProvider, useNotificationProvider } from "@refinedev/mui";
import { SessionProvider, useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { 
  Dashboard, 
  People, 
  ScreenShareOutlined,
  Business,
  PrecisionManufacturing,
  ContentPasteGo,
} from "@mui/icons-material";
import { ColorModeContextProvider } from "@contexts/color-mode";

import routerProvider from "@refinedev/nextjs-router";
import { customDataProvider } from "../providers/data-provider";

type RefineContextProps = {
  defaultMode?: string;
  children: React.ReactNode;
};

export const RefineContext = (props: RefineContextProps) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  );
};

const App = ({ defaultMode, children }: RefineContextProps) => {
  const { data: session, status } = useSession();

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
    // Usa o signIn do NextAuth
    login: async ({ email, senha }: { email: string; senha: string }) => {
      try {
        const result = await signIn("credentials", {
          email,
          senha,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Credenciais inválidas");
        }

        return {
          success: true,
          redirectTo: "/dashboard",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error : {
            message: "Falha no login. Verifique suas credenciais.",
            name: "LoginError",
          },
        };
      }
    },

    // Usa o signOut do NextAuth
    logout: async () => {
      await signOut({ redirect: false });
      return {
        success: true,
        redirectTo: "/login",
      };
    },

    // Verifica a autenticação usando a sessão do NextAuth
    check: async () => {
      if (status === "loading") {
        return {
          authenticated: false,
          loading: true,
        };
      }

      if (status === "unauthenticated") {
        return {
          authenticated: false,
          redirectTo: `/login`,
        };
      }

      return {
        authenticated: true,
      };
    },

    // Obtém as permissões do usuário da sessão
    getPermissions: async () => {
      if (session?.user?.role) {
        return [session.user.role];
      }
      return null;
    },

    // Obtém a identidade do usuário da sessão
    getIdentity: async () => {
      if (session?.user) {
        const { id, name, image, ...rest } = session.user;
        return {
          ...rest,
          id,
          name,
          avatar: image
        };
      }
      return null;
    },

    // Tratamento de erros
    onError: async (error: any) => {
      console.error("Erro de autenticação:", error);
      return { error };
    },
  };

  return (
    <RefineKbarProvider>
      <RefineSnackbarProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <Refine
            routerProvider={routerProvider}
            dataProvider={customDataProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            resources={getResourcesByRole(session?.user?.role)}
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
            {children}
            <RefineKbar />
          </Refine>
        </ColorModeContextProvider>
      </RefineSnackbarProvider>
    </RefineKbarProvider>
  );
};

export default RefineContext;