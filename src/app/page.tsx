'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/take_certo_background.png"
          alt="TakeCerto Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay desfocado com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              TakeCerto
            </h1>
            <p className="text-2xl md:text-3xl text-white mb-8 drop-shadow-md">
              Vamos jogar um jogo...
            </p>
            <p className="text-lg text-gray-200 mb-12 max-w-xl mx-auto drop-shadow-md">
              A plataforma definitiva para criar e participar de jogos interativos.
              Desafie seus amigos e divirta-se!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto">
            <Link href="/login">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 w-full shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 hover:-translate-y-1 text-lg">
                FAZER LOGIN
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-white/20 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/30 font-semibold py-4 px-8 rounded-xl transition-all duration-300 w-full shadow-2xl hover:shadow-white/25 transform hover:scale-105 hover:-translate-y-1 text-lg">
                CRIAR CONTA
              </button>
            </Link>

            {/* Texto adicional */}
            <p className="text-white/70 text-sm mt-4 text-center">
              Pronto para jogar?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
