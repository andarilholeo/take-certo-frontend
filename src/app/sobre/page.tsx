import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SobrePage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">
            Sobre o TakeCerto
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Um projeto Next.js moderno com foco em experiência mobile-first e performance otimizada.
          </p>
        </div>

        {/* Tecnologias */}
        <Card>
          <CardHeader>
            <CardTitle>Stack Tecnológico</CardTitle>
            <CardDescription>
              Tecnologias modernas para máxima performance e experiência do usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Next.js 15</h3>
                <p className="text-sm text-gray-600">
                  Framework React com App Router, Server Components e otimizações automáticas
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">TS</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">TypeScript</h3>
                <p className="text-sm text-gray-600">
                  Tipagem estática para maior confiabilidade e melhor experiência de desenvolvimento
                </p>
              </div>

              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">TW</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">TailwindCSS v4</h3>
                <p className="text-sm text-gray-600">
                  Framework CSS utilitário moderno com performance otimizada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Características Mobile-First */}
        <Card>
          <CardHeader>
            <CardTitle>Design Mobile-First</CardTitle>
            <CardDescription>
              Desenvolvido pensando primeiro na experiência mobile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Touch Optimization
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Botões com altura mínima de 44px</li>
                    <li>• Inputs otimizados para touch</li>
                    <li>• Espaçamento adequado entre elementos</li>
                    <li>• Prevenção de zoom indesejado no iOS</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Performance
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• CSS otimizado para mobile</li>
                    <li>• Font rendering aprimorado</li>
                    <li>• Smooth scrolling nativo</li>
                    <li>• Lazy loading automático</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Responsividade
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Breakpoints mobile-first</li>
                    <li>• Grid system adaptável</li>
                    <li>• Tipografia responsiva</li>
                    <li>• Safe area para dispositivos com notch</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Acessibilidade
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Focus visível em todos os elementos</li>
                    <li>• Labels adequados para screen readers</li>
                    <li>• Contraste otimizado</li>
                    <li>• Navegação por teclado</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arquitetura */}
        <Card>
          <CardHeader>
            <CardTitle>Arquitetura do Projeto</CardTitle>
            <CardDescription>
              Estrutura organizada e escalável
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-700">
{`src/
├── app/                    # App Router (Next.js 13+)
│   ├── exemplo/           # Página de demonstração
│   ├── sobre/             # Esta página
│   ├── globals.css        # Estilos globais mobile-first
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/
│   ├── layout/
│   │   └── MobileNav.tsx  # Navegação responsiva
│   └── ui/                # Biblioteca de componentes
│       ├── Button.tsx     # Botão otimizado
│       ├── Card.tsx       # Sistema de cards
│       └── Input.tsx      # Input mobile-friendly
└── lib/
    └── utils.ts           # Utilitários e helpers`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Pronto para Começar?</CardTitle>
            <CardDescription>
              Explore os componentes e comece a desenvolver sua aplicação mobile-first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" className="flex-1">
                Ver Componentes
              </Button>
              <Button variant="outline" className="flex-1">
                Documentação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
