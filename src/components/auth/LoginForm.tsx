'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email e senha são obrigatórios');
      }

      await login(formData.email, formData.password);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
          Senha
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm pr-12"
            style={{
              WebkitTextSecurity: showPassword ? 'none' : 'disc',
              fontFamily: 'inherit'
            } as React.CSSProperties}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="text-right">
        <Link href="/forgot-password" className="text-sm text-white/70 hover:text-white transition-colors">
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
      </Button>

      <div className="text-center">
        <span className="text-white/70">Não tem uma conta? </span>
        <Link href="/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">
          Criar conta
        </Link>
      </div>
    </form>
  );
}