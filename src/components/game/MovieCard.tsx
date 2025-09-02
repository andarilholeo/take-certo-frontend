'use client';

import { Movie } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

interface MovieCardProps {
  movie: Movie;
  onUploadScene: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  currentUserId: number;
}

export function MovieCard({ movie, onUploadScene, onViewDetails, currentUserId }: MovieCardProps) {
  const isOwner = movie.submittedBy.id === currentUserId;
  const progress = (movie.scenes.length / 10) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (movie.hasAllScenes) return 'text-green-400';
    if (movie.scenes.length > 0) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getStatusText = () => {
    if (movie.hasAllScenes) return 'Completo';
    if (movie.scenes.length > 0) return 'Em Progresso';
    return 'Aguardando Cenas';
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-1">{movie.title}</CardTitle>
            <CardDescription className="text-gray-400">
              {movie.year} • {movie.genre}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span className="text-xs text-gray-500">
              {isOwner ? '👤 Seu filme' : `📤 ${movie.submittedBy.username}`}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progresso das Cenas:</span>
            <span className="text-white">{movie.scenes.length}/10</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${movie.hasAllScenes ? 'bg-green-600' : 'bg-red-600'
                }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Scenes Preview */}
        {movie.scenes.length > 0 && (
          <div>
            <span className="text-gray-400 text-sm">Cenas enviadas:</span>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {movie.scenes.slice(0, 5).map((scene) => (
                <div
                  key={scene.id}
                  className="aspect-square bg-slate-700 rounded-lg overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  title={`Cena ${scene.order}: ${scene.description}`}
                  onClick={() => onViewDetails(movie)}
                >
                  <img
                    src={scene.imageUrl}
                    alt={`Cena ${scene.order}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">#{scene.order}</span>
                  </div>
                </div>
              ))}
              {movie.scenes.length > 5 && (
                <div
                  className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => onViewDetails(movie)}
                >
                  <span className="text-gray-400 text-xs">+{movie.scenes.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Movie Info */}
        <div className="text-sm">
          <div className="mb-1">
            <span className="text-gray-400">Submetido em:</span>
            <span className="text-white ml-1">{formatDate(movie.submittedAt)}</span>
          </div>
          <div>
            <span className="text-gray-400">Por:</span>
            <span className="text-white ml-1">{movie.submittedBy.username}</span>
          </div>
          <div>
            <span className="text-gray-400">ID:</span>
            <span className="text-white ml-1">{movie.id}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        {isOwner && !movie.hasAllScenes && (
          <Button
            size="sm"
            onClick={() => onUploadScene(movie)}
            style={{
              backgroundColor: 'var(--secondary)'
            }}
            className="hover:opacity-90 text-white flex items-center justify-center space-x-1 w-full"
          >
            <span>📸</span>
            <span>Enviar Cena {movie.scenes.length + 1}</span>
          </Button>
        )}

        {movie.hasAllScenes && (
          <Button
            size="sm"
            variant="outline"
            className="border-green-600 text-green-400 hover:bg-green-700 hover:text-white flex items-center justify-center space-x-1 w-full"
          >
            <span>✅</span>
            <span>Completo</span>
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetails(movie)}
          style={{
              backgroundColor: 'var(--info)'
          }}
          className="text-white hover:opacity-90 w-full"
        >
          {isOwner ? '🎬 Gerenciar Cenas' : '👁️ Ver Cenas'}
        </Button>
      </CardFooter>
    </Card>
  );
}
