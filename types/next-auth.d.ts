import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    setorId: number;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
    accessToken: string;
    setorId: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    accessToken: string;
    setorId: number;
  }
}