'use client';

import { Room } from '@/types/game';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

interface RoomCardProps {
  room: Room;
  onJoin: (roomId: number) => void;
  onLeave: (roomId: number) => void;
  onManageMovies: (roomId: number) => void;
  currentUserId: number;
}

export function RoomCard({ room, onJoin, onLeave, onManageMovies, currentUserId }: RoomCardProps) {
  const isOwner = room.createdBy.id === currentUserId;
  const isParticipant = room.players.some(p => p.player.id === currentUserId);
  
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'text-yellow-400'; // Waiting
      case 1:
        return 'text-green-400';  // InProgress
      case 2:
        return 'text-gray-400';   // Finished
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Aguardando';
      case 1:
        return 'Em Andamento';
      case 2:
        return 'Finalizada';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-1">{room.name}</CardTitle>
            <CardDescription className="text-gray-400">
              {room.description}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className={`text-xs font-medium ${getStatusColor(room.status)}`}>
              {getStatusText(room.status)}
            </span>
            <span className="text-xs text-gray-500">
              {room.isPrivate ? '🔒 Privada' : '🌐 Pública'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Room Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Jogadores:</span>
            <span className="text-white ml-1">
              {room.currentPlayerCount}/{room.maxPlayers}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Código:</span>
            <span className="text-blue-400 ml-1 font-mono">
              {room.roomCode}
            </span>
          </div>
        </div>

        {/* Game Settings */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Filmes/Jogador:</span>
            <span className="text-white ml-1">{room.moviesPerPlayer}</span>
          </div>
          <div>
            <span className="text-gray-400">Cenas/Filme:</span>
            <span className="text-white ml-1">{room.scenesPerMovie}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="text-sm">
          <div className="mb-1">
            <span className="text-gray-400">Criada em:</span>
            <span className="text-white ml-1">{formatDate(room.createdAt)}</span>
          </div>
          {room.startedAt && (
            <div className="mb-1">
              <span className="text-gray-400">Iniciada em:</span>
              <span className="text-white ml-1">{formatDate(room.startedAt)}</span>
            </div>
          )}
          {room.finishedAt && (
            <div>
              <span className="text-gray-400">Finalizada em:</span>
              <span className="text-white ml-1">{formatDate(room.finishedAt)}</span>
            </div>
          )}
        </div>

        {/* Players Preview */}
        {room.players.length > 0 && (
          <div>
            <span className="text-gray-400 text-sm">Jogadores:</span>
            <div className="flex items-center space-x-2 mt-1">
              {room.players.slice(0, 3).map((roomPlayer) => (
                <div
                  key={roomPlayer.id}
                  className="flex items-center space-x-1"
                >
                  <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">
                      {roomPlayer.player.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-300">{roomPlayer.player.username}</span>
                  {roomPlayer.isReady && (
                    <span className="text-xs text-green-400">✓</span>
                  )}
                </div>
              ))}
              {room.players.length > 3 && (
                <span className="text-gray-400 text-xs">
                  +{room.players.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {isOwner ? 'Criada por você' : `Criada por ${room.createdBy.username}`}
        </div>
        
        <div className="flex space-x-2">
          {room.status === 0 && !isParticipant && room.canJoin && (
            <Button
              size="sm"
              onClick={() => onJoin(room.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Entrar
            </Button>
          )}

          {isParticipant && room.status === 0 && (
            <>
              <Button
                size="sm"
                onClick={() => onManageMovies(room.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Filmes
              </Button>
              {!isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLeave(room.id)}
                  className="border-red-600 text-red-400 hover:bg-red-700 hover:text-white"
                >
                  Sair
                </Button>
              )}
            </>
          )}

          {isParticipant && room.status === 1 && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Jogar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onManageMovies(room.id)}
                className="border-blue-600 text-blue-400 hover:bg-blue-700 hover:text-white"
              >
                Filmes
              </Button>
            </>
          )}

          {isOwner && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Gerenciar
            </Button>
          )}

          {room.status === 2 && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Ver Resultado
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
