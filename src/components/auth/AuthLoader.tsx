'use client';

export function AuthLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Verificando autenticação...</p>
        <p className="text-gray-400 text-sm mt-2">Aguarde um momento</p>
      </div>
    </div>
  );
}
