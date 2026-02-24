import { useState, useEffect } from 'react';
import { UserRole } from '@/utils/ordemProducaoStatus';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  // Add other fields as needed
}

export function useLocalUser(): { user: User | null; token: string | null } {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const tokenStr = localStorage.getItem('token');
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          setToken(tokenStr);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }
  }, []);

  return { user, token };
}
