'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.username || !formData.email || !formData.password) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (formData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      await register(formData.username, formData.email, formData.password);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar conta');
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
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
          Nome de Usuário
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Seu nome de usuário"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Senha
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="bg-slate-800 border-slate-700 text-white placeholder-gray-400 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Confirmar Senha
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white placeholder-gray-400"
          required
        />
      </div>

      <div className="text-sm text-gray-400">
        <p>Ao criar uma conta, você concorda com nossos:</p>
        <div className="flex space-x-4 mt-1">
          <a href="/terms" className="text-red-500 hover:text-red-400">
            Termos de Uso
          </a>
          <a href="/privacy" className="text-red-500 hover:text-red-400">
            Política de Privacidade
          </a>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3"
      >
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </form>
  );
}
