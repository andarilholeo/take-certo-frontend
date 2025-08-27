'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

export default function ExemploPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    const newErrors: Record<string, string> = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('Formulário enviado com sucesso!');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">
            Página de Exemplo
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Demonstração dos componentes mobile-first do TakeCerto
          </p>
        </div>

        {/* Botões */}
        <Card>
          <CardHeader>
            <CardTitle>Componentes de Botão</CardTitle>
            <CardDescription>
              Botões otimizados para touch com diferentes variantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="primary" fullWidth>
                Primário
              </Button>
              <Button variant="secondary" fullWidth>
                Secundário
              </Button>
              <Button variant="outline" fullWidth>
                Contorno
              </Button>
              <Button variant="ghost" fullWidth>
                Ghost
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Button size="sm" fullWidth>
                Pequeno
              </Button>
              <Button size="md" fullWidth>
                Médio
              </Button>
              <Button size="lg" fullWidth>
                Grande
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Formulário Mobile-First</CardTitle>
            <CardDescription>
              Inputs otimizados para dispositivos móveis com validação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome Completo"
                placeholder="Digite seu nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                error={errors.nome}
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                fullWidth
              />
              <Input
                label="Telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                error={errors.telefone}
                fullWidth
              />
              <div className="pt-4">
                <Button type="submit" fullWidth>
                  Enviar Formulário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Cards de Exemplo */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Card Padrão</CardTitle>
              <CardDescription>
                Card com estilo padrão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Este é um exemplo de card com o estilo padrão. Perfeito para conteúdo geral.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" fullWidth>
                Ação
              </Button>
            </CardFooter>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Card Contornado</CardTitle>
              <CardDescription>
                Card com borda destacada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Este card tem uma borda mais destacada para chamar atenção.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" fullWidth>
                Ação
              </Button>
            </CardFooter>
          </Card>

          <Card variant="elevated" className="sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Card Elevado</CardTitle>
              <CardDescription>
                Card com sombra elevada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Este card tem uma sombra mais pronunciada para destacar conteúdo importante.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" fullWidth>
                Ação
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Informações sobre Mobile-First */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Características Mobile-First</CardTitle>
            <CardDescription>
              Recursos implementados para otimizar a experiência mobile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Touch Targets</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Botões com altura mínima de 44px</li>
                  <li>• Inputs otimizados para touch</li>
                  <li>• Espaçamento adequado entre elementos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CSS otimizado para mobile</li>
                  <li>• Prevenção de zoom indesejado</li>
                  <li>• Smooth scrolling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Responsividade</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Breakpoints mobile-first</li>
                  <li>• Grid adaptável</li>
                  <li>• Tipografia responsiva</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Acessibilidade</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Focus visível</li>
                  <li>• Labels adequados</li>
                  <li>• Contraste otimizado</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
