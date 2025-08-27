export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">
              Bem-vindo ao TakeCerto
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Sua plataforma mobile-first para gerenciar e organizar suas atividades de forma eficiente.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-gray-600 text-sm">
                Desenvolvido pensando primeiro na experiência mobile, garantindo performance em todos os dispositivos.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-gray-600 text-sm">
                Construído com Next.js e TypeScript para máxima performance e confiabilidade.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsivo</h3>
              <p className="text-gray-600 text-sm">
                Interface adaptável que funciona perfeitamente em smartphones, tablets e desktops.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-full sm:w-auto">
              Começar Agora
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 TakeCerto. Desenvolvido com Next.js, TypeScript e TailwindCSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
