'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomCode: string) => void;
  isLoading?: boolean;
}

export function JoinRoomModal({ isOpen, onClose, onSubmit, isLoading = false }: JoinRoomModalProps) {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (!roomCode.trim()) {
      setError('Código da sala é obrigatório');
      return;
    }

    // Validar formato do código (6 caracteres alfanuméricos)
    const codeRegex = /^[A-Z0-9]{6}$/;
    const cleanCode = roomCode.trim().toUpperCase();
    
    if (!codeRegex.test(cleanCode)) {
      setError('Código deve ter 6 caracteres (letras e números)');
      return;
    }

    onSubmit(cleanCode);
  };

  const handleClose = () => {
    setRoomCode('');
    setError('');
    onClose();
  };

  const handleCodeChange = (value: string) => {
    // Converter para maiúsculo e limitar a 6 caracteres
    const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(cleanValue);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Entrar em uma Sala</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Código da Sala"
                placeholder="Ex: ABC123"
                value={roomCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                error={error}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 text-center text-lg font-mono tracking-wider"
                fullWidth
                maxLength={6}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-400 mt-2">
                Digite o código de 6 caracteres da sala
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-slate-900 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">💡 Como funciona:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Peça o código da sala para o criador</li>
                <li>• O código tem 6 caracteres (ex: ABC123)</li>
                <li>• Você será adicionado automaticamente à sala</li>
                <li>• Aguarde outros jogadores para começar</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading || !roomCode.trim()}
              >
                {isLoading ? 'Entrando...' : 'Entrar na Sala'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
