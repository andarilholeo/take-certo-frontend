'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SuccessModal } from '@/components/ui/SuccessModal';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register, isLoading } = useAuth();
  const router = useRouter();

  // UseEffect para mostrar modal quando registro for bem-sucedido
  useEffect(() => {
    if (registrationSuccess) {
      console.log('🎯 useEffect detectou registro bem-sucedido, mostrando modal...');
      setShowSuccessModal(true);
    }
  }, [registrationSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log('🚀 Iniciando handleSubmit...');

      if (!formData.username || !formData.email || !formData.password) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (formData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      console.log('✅ Validações passaram. Iniciando processo de registro...');
      console.log('📝 Dados do formulário:', { username: formData.username, email: formData.email });

      const result = await register(formData.username, formData.email, formData.password);

      console.log('📋 Resultado do registro:', result);
      console.log('🎉 Registro bem-sucedido! Ativando flag de sucesso...');

      setRegistrationSuccess(true);
      console.log('📱 Flag de sucesso ativada. registrationSuccess:', true);

    } catch (error) {
      console.error('❌ Erro capturado no handleSubmit:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar conta');
    }
  };

  const handleSuccessModalClose = () => {
    console.log('🔄 Fechando modal e redirecionando para login...');
    setShowSuccessModal(false);
    setRegistrationSuccess(false);
    router.push('/login');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
            Nome de Usuário
          </label>
          <Input
            id="username"
            type="text"
            placeholder="Seu nome de usuário"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm"
            required
          />
        </div>

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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
            Confirmar Senha
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm"
            required
          />
        </div>

        <div className="text-sm text-white/70">
          <p>Ao criar uma conta, você concorda com nossos:</p>
          <div className="flex space-x-4 mt-1">
            <a href="/terms" className="text-red-400 hover:text-red-300 transition-colors">
              Termos de Uso
            </a>
            <a href="/privacy" className="text-red-400 hover:text-red-300 transition-colors">
              Política de Privacidade
            </a>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {isLoading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
        </Button>


      </form>

      {/* Modal de Sucesso */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Conta criada com sucesso!"
        message="Sua conta foi criada com sucesso. Agora você pode fazer login e começar a jogar!"
        buttonText="Ir para Login"
        icon={
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    </>
  );
}
