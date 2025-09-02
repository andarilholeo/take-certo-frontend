'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Movie, Scene } from '@/types/game';

interface MovieScenesModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  currentUserId: number;
  onDeleteScene: (sceneId: number) => void;
  onReorderScenes: (movieId: number, sceneOrders: { sceneId: number; newOrder: number }[]) => void;
  isLoading?: boolean;
}

export function MovieScenesModal({ 
  isOpen, 
  onClose, 
  movie, 
  currentUserId, 
  onDeleteScene, 
  onReorderScenes,
  isLoading = false 
}: MovieScenesModalProps) {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Atualizar cenas quando o filme mudar
  React.useEffect(() => {
    if (movie) {
      const sortedScenes = [...movie.scenes].sort((a, b) => a.order - b.order);
      setScenes(sortedScenes);
    }
  }, [movie]);

  const isOwner = movie?.submittedBy.id === currentUserId;

  const handleDeleteScene = (scene: Scene) => {
    if (window.confirm(`Tem certeza que deseja deletar a cena ${scene.order}?\n\n"${scene.description}"`)) {
      onDeleteScene(scene.id);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isOwner) return;
    setIsDragging(true);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!isOwner || draggedIndex === null || draggedIndex === dropIndex) {
      setIsDragging(false);
      setDraggedIndex(null);
      return;
    }

    const newScenes = [...scenes];
    const draggedScene = newScenes[draggedIndex];
    
    // Remove o item da posição original
    newScenes.splice(draggedIndex, 1);
    // Insere na nova posição
    newScenes.splice(dropIndex, 0, draggedScene);

    // Atualizar ordens
    const sceneOrders = newScenes.map((scene, index) => ({
      sceneId: scene.id,
      newOrder: index + 1
    }));

    setScenes(newScenes);
    setIsDragging(false);
    setDraggedIndex(null);

    // Chamar função de reordenação
    if (movie) {
      onReorderScenes(movie.id, sceneOrders);
    }
  };

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-slate-800 p-6 rounded-lg flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-400"></div>
              <span className="text-white">Processando...</span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <p className="text-gray-400">
                {movie.year} • {movie.genre} • {scenes.length} cenas
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex gap-6 h-[70vh]">
            {/* Scenes Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {scenes.map((scene, index) => (
                  <Card
                    key={scene.id}
                    className={`bg-slate-700 border-slate-600 cursor-pointer transition-all ${
                      selectedScene?.id === scene.id ? 'ring-2 ring-blue-500' : ''
                    } ${isDragging && draggedIndex === index ? 'opacity-50' : ''}`}
                    draggable={isOwner}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => setSelectedScene(scene)}
                  >
                    <CardContent className="p-3">
                      <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden mb-2 relative">
                        <img
                          src={scene.imageUrl}
                          alt={`Cena ${scene.order}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                          }}
                        />
                        {/* Scene number overlay */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          #{scene.order}
                        </div>
                        {/* Drag indicator */}
                        {isOwner && (
                          <div className="absolute top-2 right-2 text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium mb-1">Cena {scene.order}</p>
                      <p className="text-gray-400 text-xs line-clamp-2">{scene.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {scenes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">Nenhuma cena enviada ainda</p>
                </div>
              )}
            </div>

            {/* Scene Details */}
            {selectedScene && (
              <div className="w-80 bg-slate-700 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Cena {selectedScene.order}</h3>
                    <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
                      <img
                        src={selectedScene.imageUrl}
                        alt={`Cena ${selectedScene.order}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-300 text-sm font-medium mb-2">Descrição:</h4>
                    <p className="text-white text-sm">{selectedScene.description}</p>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <p>ID: {selectedScene.id}</p>
                    <p>Enviado em: {new Date(selectedScene.uploadedAt).toLocaleDateString('pt-BR')}</p>
                  </div>

                  {isOwner && (
                    <div className="pt-4 border-t border-slate-600">
                      <Button
                        onClick={() => handleDeleteScene(selectedScene)}
                        variant="outline"
                        className="w-full border-red-600 text-red-400 hover:bg-red-700 hover:text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-2"></div>
                            Deletando...
                          </>
                        ) : (
                          <>🗑️ Deletar Cena</>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {isOwner && scenes.length > 0 && (
            <div className="mt-4 bg-blue-900/20 p-3 rounded-lg">
              <p className="text-blue-200 text-sm">
                💡 <strong>Dica:</strong> Arraste as cenas para reordenar. Clique em uma cena para ver detalhes e opções.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
