'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateMovieData } from '@/types/game';

interface SubmitMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMovieData) => void;
  isLoading?: boolean;
}

export function SubmitMovieModal({ isOpen, onClose, onSubmit, isLoading = false }: SubmitMovieModalProps) {
  const [formData, setFormData] = useState<CreateMovieData>({
    title: '',
    year: new Date().getFullYear(),
    genre: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 5) {
      newErrors.year = 'Ano deve estar entre 1900 e ' + (new Date().getFullYear() + 5);
    }
    if (!formData.genre.trim()) newErrors.genre = 'Gênero é obrigatório';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        year: new Date().getFullYear(),
        genre: ''
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      genre: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Submeter Filme</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Título do Filme"
              placeholder="Ex: A Viagem de Chihiro"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              fullWidth
              disabled={isLoading}
            />

            <Input
              label="Ano de Lançamento"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 5}
              value={formData.year.toString()}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
              error={errors.year}
              className="bg-slate-700 border-slate-600 text-white"
              fullWidth
              disabled={isLoading}
            />

            <Input
              label="Gênero"
              placeholder="Ex: Animação, Drama, Aventura"
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              error={errors.genre}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              fullWidth
              disabled={isLoading}
            />

            {/* Info Box */}
            <div className="bg-slate-900 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">📽️ Dicas:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Escolha filmes que você conhece bem</li>
                <li>• Após submeter, você precisará enviar as cenas</li>
                <li>• Certifique-se de que o título está correto</li>
                <li>• O gênero ajuda outros jogadores a identificar o filme</li>
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
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Submetendo...' : 'Submeter Filme'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
