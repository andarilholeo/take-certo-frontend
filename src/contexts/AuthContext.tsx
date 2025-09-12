'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG, apiRequest } from '@/lib/api';
import { Player, LoginResponse, RegisterResponse, ApiResponse } from '@/types/game';
import { AuthLoader } from '@/components/auth/AuthLoader';

interface AuthContextType {
  user: Player | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<ApiResponse<RegisterResponse>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');

      if (token && userData) {

        await apiRequest('/Rooms/my-rooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(JSON.parse(userData));
        //console.log('✅ Sessão restaurada com sucesso');
      } else {
        //console.log('❌ Token ou dados do usuário não encontrados');
      }
    } catch (error) {
      console.group('❌ ERRO NO CHECK AUTH');
      console.error('❌ Token inválido ou expirado:', error);
      console.log('🧹 Limpando localStorage...');
      console.log('🚪 Chamando logout implícito...');
      console.groupEnd();

      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
}, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response: ApiResponse<LoginResponse> = await apiRequest(API_CONFIG.endpoints.auth.login || '/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.data?.token && response.data?.player) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.player));
        setUser(response.data.player);

        router.push('/dashboard');
      } else {
        console.error('❌ Falha no login:', response.message);
        throw new Error(response.message || 'Falha na autenticação');
      }
    } catch (error) {
      console.error('🚨 Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<ApiResponse<RegisterResponse>> => {
    try {
      setIsLoading(true);

      const response: ApiResponse<RegisterResponse> = await apiRequest(API_CONFIG.endpoints.auth.register || '/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      return response;
    } catch (error) {
      if (error && typeof error === 'object' && 'success' in error) {
        return error as ApiResponse<RegisterResponse>;
      }

      return {
        success: false,
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Erro ao criar conta',
        timestamp: new Date().toISOString(),
        requestId: 'unknown'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.group('🚪 LOGOUT CHAMADO');
    console.log('📍 Stack trace:', new Error().stack);
    console.log('🔍 User atual:', user);
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.groupEnd();

    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
