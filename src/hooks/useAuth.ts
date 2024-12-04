import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id?: string;
  type?: 'criativo' | 'org'; 
  exp?: number;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  fotoPerfil: {
    data: number[];
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  userData: UserData | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    userData: null,
    loading: true,
  });

  const port = import.meta.env.VITE_PORT;

  const fetchUserData = useCallback(async (userId: string, userType: 'criativo' | 'org') => {
    try {
      let url = '';

      if (userType === 'criativo') {
        url = `${port}/get-usuario-criativo-by-id/${userId}`;
      } else if (userType === 'org') {
        url = `${port}/get-usuario-org-by-id/${userId}`;
      }

      const response = await fetch(url);
      const data: UserData = await response.json();

      setAuthState((prevState) => ({
        ...prevState,
        userData: data,
        loading: false,
      }));
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setAuthState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [port]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : false;

        if (isExpired) {
          throw new Error('Token expirado');
        }

        if (decoded.id && decoded.type) {
          fetchUserData(decoded.id, decoded.type);
        }

        setAuthState((prevState) => ({
          ...prevState,
          isAuthenticated: true,
          user: decoded,
        }));
      } catch (error) {
        console.error('Token inválido ou expirado:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          userData: null,
          loading: false,
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        userData: null,
        loading: false,
      });
    }
  }, [fetchUserData]);

  return authState;
}
