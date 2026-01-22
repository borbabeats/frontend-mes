"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { RefineSnackbarProvider, useNotificationProvider } from "@refinedev/mui";
import { SessionProvider, useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

import routerProvider from "@refinedev/nextjs-router";
import { customDataProvider } from "@providers/data-provider";

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
        <Refine
          routerProvider={routerProvider}
          dataProvider={customDataProvider}
          authProvider={authProvider}
          notificationProvider={useNotificationProvider}
          resources={[
            {
              name: "dashboard",
              list: "/dashboard",
              meta: {
                label: "Dashboard"
              }
            },
            {
              name: "maquinas",
              list: "/maquinas",
              show: "/maquinas/detalhes/:id",
              edit: "/maquinas/editar/:id",
              create: "/maquinas/criar",
              meta: {
                label: "Máquinas"
              }
            },
            {
              name: "setores",
              list: "/setores",
              show: "/setores/detalhes/:id",
              edit: "/setores/editar/:id",
              create: "/setores/criar",
              meta: {
                label: "Setores"
              }
            },
            {
              name: "usuarios",
              list: "/usuarios",
              show: "/usuarios/detalhes/:id",
              edit: "/usuarios/editar/:id",
              create: "/usuarios/criar",
              meta: {
                label: "Usuários"
              }
            }
            // Adicione outros recursos conforme necessário
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            disableTelemetry: true,
            reactQuery: {
              clientConfig: {
                defaultOptions: {
                  queries: {
                    staleTime: 5 * 60 * 1000, // 5 minutos
                  },
                },
              },
            },
          }}
        >
          {children}
          <RefineKbar />
        </Refine>
      </RefineSnackbarProvider>
    </RefineKbarProvider>
  );
};

export default RefineContext;