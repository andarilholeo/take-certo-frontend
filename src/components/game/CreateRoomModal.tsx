'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CreateRoomData {
  name: string;
  description: string;
  maxPlayers: number;
  moviesPerPlayer: number;
  scenesPerMovie: number;
  isPrivate: boolean;
}

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoomData) => void;
}

export function CreateRoomModal({ isOpen, onClose, onSubmit }: CreateRoomModalProps) {
  const [formData, setFormData] = useState<CreateRoomData>({
    name: '',
    description: '',
    maxPlayers: 4,
    moviesPerPlayer: 4,
    scenesPerMovie: 10,
    isPrivate: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (formData.maxPlayers < 2) newErrors.maxPlayers = 'Mínimo de 2 jogadores';
    if (formData.maxPlayers > 10) newErrors.maxPlayers = 'Máximo de 10 jogadores';
    if (formData.moviesPerPlayer < 1) newErrors.moviesPerPlayer = 'Mínimo de 1 filme por jogador';
    if (formData.scenesPerMovie < 1) newErrors.scenesPerMovie = 'Mínimo de 1 cena por filme';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        description: '',
        maxPlayers: 4,
        moviesPerPlayer: 4,
        scenesPerMovie: 10,
        isPrivate: false
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Criar Nova Sala</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
              
              <Input
                label="Nome da Sala"
                placeholder="Ex: Sala dos Amigos"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                fullWidth
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva sua sala..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-400 mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Game Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Configurações do Jogo</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Máximo de Jogadores"
                  type="number"
                  min="2"
                  max="10"
                  value={formData.maxPlayers.toString()}
                  onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value) || 2)}
                  error={errors.maxPlayers}
                  className="bg-slate-700 border-slate-600 text-white"
                  fullWidth
                />

                <Input
                  label="Filmes por Jogador"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.moviesPerPlayer.toString()}
                  onChange={(e) => handleInputChange('moviesPerPlayer', parseInt(e.target.value) || 1)}
                  error={errors.moviesPerPlayer}
                  className="bg-slate-700 border-slate-600 text-white"
                  fullWidth
                />

                <Input
                  label="Cenas por Filme"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.scenesPerMovie.toString()}
                  onChange={(e) => handleInputChange('scenesPerMovie', parseInt(e.target.value) || 1)}
                  error={errors.scenesPerMovie}
                  className="bg-slate-700 border-slate-600 text-white"
                  fullWidth
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={formData.isPrivate}
                    onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="isPrivate" className="text-sm text-gray-300">
                    Sala privada (apenas com código de acesso)
                  </label>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-slate-900 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">ℹ️ Como funciona:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Cada jogador submete {formData.moviesPerPlayer} filmes</li>
                <li>• Cada filme terá {formData.scenesPerMovie} cenas para adivinhar</li>
                <li>• {formData.isPrivate ? 'Sala privada: apenas quem tem o código pode entrar' : 'Sala pública: qualquer um pode encontrar e entrar'}</li>
                <li>• Máximo de {formData.maxPlayers} jogadores por sala</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
              >
                Criar Sala
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
