import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, SessionStrategy } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              senha: credentials?.senha,
            }),
          });

          if (!res.ok) {
            // Se a resposta não for bem-sucedida, retorna null
            const errorData = await res.json().catch(() => ({}));
            console.error("Erro na autenticação:", errorData);
            return null;
          }

          const data = await res.json();
          
          // Retorna o usuário no formato que o NextAuth espera
          return {
            id: data.user.id.toString(),
            name: data.user.nome,
            email: data.user.email,
            role: data.user.cargo,
            image: data.user.photo_profile,
            accessToken: data.access_token,
            setorId: data.user.setorId,
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Passa os dados do usuário para o token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.setorId = user.setorId;
      }
      return token;
    },
    async session({ session, token }) {
      // Passa os dados do token para a sessão
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.setorId = token.setorId as number;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login/error",
  },

  secret: process.env.NEXTAUTH_SECRET || "seu-segredo-aqui",
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;