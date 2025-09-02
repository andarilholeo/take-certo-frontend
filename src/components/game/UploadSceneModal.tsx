'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Movie } from '@/types/game';

interface UploadSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movieId: number, order: number, description: string, imageFile: File) => void;
  movie: Movie | null;
  isLoading?: boolean;
}

export function UploadSceneModal({ isOpen, onClose, onSubmit, movie, isLoading = false }: UploadSceneModalProps) {
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextSceneOrder = movie ? movie.scenes.length + 1 : 1;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, file: 'Apenas arquivos de imagem são permitidos' }));
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'Arquivo deve ter no máximo 5MB' }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!movie) return;

    // Validação
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!selectedFile) newErrors.file = 'Imagem da cena é obrigatória';

    // Validação adicional do arquivo
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        newErrors.file = 'Apenas arquivos de imagem são permitidos';
      } else if (selectedFile.size > 5 * 1024 * 1024) {
        newErrors.file = 'Arquivo deve ter no máximo 5MB';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && selectedFile) {
      console.log('🎬 Iniciando upload da cena:', {
        movieId: movie.id,
        order: nextSceneOrder,
        description: description.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      });

      onSubmit(movie.id, nextSceneOrder, description.trim(), selectedFile);
      // Não fechar o modal aqui - deixar a função pai decidir quando fechar
    }
  };

  const handleClose = () => {
    setDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Upload de Cena</h2>
              <p className="text-gray-400">
                {movie.title} - Cena {nextSceneOrder}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagem da Cena
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isLoading ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600'
              }`}>
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview da cena"
                      className="max-w-full max-h-48 mx-auto rounded-lg"
                    />
                    <div className="text-sm text-gray-400">
                      {selectedFile && (
                        <p>📁 {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      disabled={isLoading}
                    >
                      Trocar Imagem
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Clique para selecionar uma imagem</p>
                      <p className="text-sm">PNG, JPG, GIF até 5MB</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      disabled={isLoading}
                    >
                      Selecionar Arquivo
                    </Button>
                  </div>
                )}

                {isLoading && (
                  <div className="mt-4 p-4 bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span className="text-blue-400 text-sm">Enviando imagem...</span>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading}
              />
              {errors.file && (
                <p className="text-sm text-red-400 mt-1">{errors.file}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição da Cena
              </label>
              <textarea
                placeholder="Descreva brevemente o que acontece nesta cena..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Progress Info */}
            <div className="bg-slate-900 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">📊 Progresso:</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cenas enviadas:</span>
                  <span className="text-white">{movie.scenes.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Próxima cena:</span>
                  <span className="text-blue-400">#{nextSceneOrder}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(movie.scenes.length / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400">
                  {movie.hasAllScenes ? 'Todas as cenas enviadas!' : `${10 - movie.scenes.length} cenas restantes`}
                </p>
              </div>
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
                {isLoading ? 'Enviando...' : 'Enviar Cena'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
