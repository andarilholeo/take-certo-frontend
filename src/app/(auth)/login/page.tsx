import { LoginForm } from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/take_certo_background_2.png"
          alt="TakeCerto Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Vamos jogar um jogo...
            </h1>
            <p className="text-xl text-white/80 mb-8 drop-shadow-md">
              Faça seu login
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}