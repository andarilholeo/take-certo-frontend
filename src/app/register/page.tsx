import { RegisterForm } from '@/components/auth/RegisterForm';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
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
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-white hover:text-white/80 transition-colors drop-shadow-lg">
              TakeCerto
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 mt-6 drop-shadow-lg">
              Criar Conta
            </h1>
            <p className="text-xl text-white/80 mb-8 drop-shadow-md">
              Junte-se à comunidade de jogadores
            </p>
          </div>

          {/* Register Form Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <RegisterForm />
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <span className="text-white/70 drop-shadow-md">Já tem uma conta? </span>
            <Link href="/login" className="text-red-400 hover:text-red-300 font-medium drop-shadow-md transition-colors">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
