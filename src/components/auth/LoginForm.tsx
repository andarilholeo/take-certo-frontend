'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-slate-800 border-slate-700 text-white placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="bg-slate-800 border-slate-700 text-white placeholder-gray-400 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="text-right">
        <a href="#" className="text-sm text-gray-400 hover:text-gray-300">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
      >
        Sign in
      </Button>

      <div className="text-center">
        <span className="text-gray-400">Don't have an account? </span>
        <a href="/signup" className="text-red-500 hover:text-red-400 font-medium">
          Sign up
        </a>
      </div>
    </form>
  );
}