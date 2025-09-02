import { LoginForm } from '@/components/auth/LoginForm';
import { ConnectionStatus } from '@/components/debug/ConnectionStatus';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="relative aspect-[3/4] max-w-md mx-auto">
            <Image
              src="/backgrounds/take_certo_background.png"
              alt="Leonardo DiCaprio Meme"
              fill
              sizes="(max-width: 768px) 0px, (max-width: 1024px) 50vw, 400px"
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">Vamos jogar um jogo...</h1>
            <p className="text-gray-400 mb-8">Faça sua conta</p>

            <LoginForm />
          </div>

          {/* Debug Tools - remover em produção */}
          <ConnectionStatus />
        </div>
      </div>
    </div>
  );
}