import { RegisterForm } from '@/components/auth/RegisterForm';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="relative aspect-[3/4] max-w-md mx-auto">
            <Image
              src="/backgrounds/take_certo_background.png"
              alt="TakeCerto Background"
              fill
              sizes="(max-width: 768px) 0px, (max-width: 1024px) 50vw, 400px"
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
              TakeCerto
            </Link>
          </div>
          
          <h1 className="text-white text-3xl font-bold mb-2">Criar Conta</h1>
          <p className="text-gray-400 mb-8">Junte-se à comunidade de jogadores</p>
          
          <RegisterForm />
          
          <div className="mt-6 text-center">
            <span className="text-gray-400">Já tem uma conta? </span>
            <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
