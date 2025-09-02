'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG, apiRequest } from '@/lib/api';
import { Player, LoginResponse } from '@/types/game';
import { AuthLoader } from '@/components/auth/AuthLoader';

interface AuthContextType {
  user: Player | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Verificar se há token salvo ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
          console.log('🔑 Token e dados do usuário encontrados, verificando validade...');

          // Verificar se o token é válido fazendo uma requisição autenticada
          await apiRequest('/Rooms/my-rooms', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Se chegou até aqui, o token é válido
          setUser(JSON.parse(userData));
          console.log('✅ Sessão restaurada com sucesso');
        } else {
          console.log('❌ Token ou dados do usuário não encontrados');
        }
      } catch (error) {
        console.error('❌ Token inválido ou expirado:', error);
        // Token inválido, limpar dados
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
      console.log('🔐 Tentando fazer login com:', { email });

      const response = await apiRequest(API_CONFIG.endpoints.auth.login || '/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      console.log('📋 Resposta do login:', response);

      // Verificar estrutura da API real
      if (response.token && response.player) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.player));
        setUser(response.player);

        console.log('✅ Login realizado com sucesso');
        router.push('/dashboard');
      } else {
        console.error('❌ Estrutura de resposta inválida:', response);
        throw new Error('Resposta inválida do servidor - token ou player não encontrado');
      }
    } catch (error) {
      console.error('🚨 Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('📝 Tentando registrar usuário:', { username, email });

      const response = await apiRequest(API_CONFIG.endpoints.auth.register || '/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      console.log('📋 Resposta do registro:', response);

      if (response.token && response.player) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.player));
        setUser(response.player);

        console.log('✅ Registro realizado com sucesso');
        router.push('/dashboard');
      } else {
        console.error('❌ Estrutura de resposta inválida:', response);
        throw new Error('Resposta inválida do servidor - token ou player não encontrado');
      }
    } catch (error) {
      console.error('🚨 Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
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

  // Mostrar loader enquanto verifica autenticação
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
