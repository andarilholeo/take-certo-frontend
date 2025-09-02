'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GameInterface } from '@/components/game/GameInterface';
import { Room, GameState, SubmitGuessData, AssignPointData } from '@/types/game';
import { apiRequest } from '@/lib/api';
import { isOnlineRoom, isRoomOwner } from '@/lib/roomUtils';

export default function GamePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const roomId = parseInt(params.id as string);

  const [room, setRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameLoading, setIsGameLoading] = useState(false);

  useEffect(() => {
    loadRoomData();
    loadGameState();
    
    // Polling para atualizar estado do jogo
    const interval = setInterval(loadGameState, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const loadRoomData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const roomData = await apiRequest(`/Rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRoom(roomData);
    } catch (error) {
      console.error('❌ Erro ao carregar dados da sala:', error);
    }
  };

  const loadGameState = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('🎮 Carregando estado do jogo:', roomId);
      
      const gameData = await apiRequest(`/Game/rooms/${roomId}/state`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📊 Estado do jogo carregado:', gameData);
      setGameState(gameData);

    } catch (error) {
      console.error('❌ Erro ao carregar estado do jogo:', error);
      setGameState(null);
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = async () => {
    try {
      setIsGameLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🚀 Iniciando jogo na sala:', roomId);
      
      await apiRequest(`/Game/rooms/${roomId}/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Jogo iniciado com sucesso');
      
      // Recarregar estado do jogo
      await loadGameState();
      
    } catch (error) {
      console.error('❌ Erro ao iniciar jogo:', error);
      alert('Erro ao iniciar jogo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleSubmitGuess = async (data: SubmitGuessData) => {
    try {
      setIsGameLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🎯 Enviando palpite:', data);
      
      await apiRequest(`/Game/guess`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      console.log('✅ Palpite enviado com sucesso');
      
      // Recarregar estado do jogo
      await loadGameState();
      
    } catch (error) {
      console.error('❌ Erro ao enviar palpite:', error);
      alert('Erro ao enviar palpite: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleAssignPoint = async (data: AssignPointData) => {
    try {
      setIsGameLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🏆 Atribuindo ponto:', data);
      
      await apiRequest(`/Game/assign-point`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });

      console.log('✅ Ponto atribuído com sucesso');
      
      // Recarregar estado do jogo
      await loadGameState();
      
    } catch (error) {
      console.error('❌ Erro ao atribuir ponto:', error);
      alert('Erro ao atribuir ponto: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleNextScene = async () => {
    try {
      setIsGameLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('⏭️ Avançando para próxima cena');
      
      await apiRequest(`/Game/rooms/${roomId}/next-scene`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Próxima cena carregada');
      
      // Recarregar estado do jogo
      await loadGameState();
      
    } catch (error) {
      console.error('❌ Erro ao avançar cena:', error);
      alert('Erro ao avançar cena: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleEndGame = async () => {
    try {
      setIsGameLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      if (!window.confirm('Tem certeza que deseja encerrar o jogo?')) {
        return;
      }

      console.log('🏁 Encerrando jogo');
      
      await apiRequest(`/Game/rooms/${roomId}/end`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Jogo encerrado');
      
      // Voltar para dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('❌ Erro ao encerrar jogo:', error);
      alert('Erro ao encerrar jogo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGameLoading(false);
    }
  };

  const isOwner = room ? isRoomOwner(room, user?.id || 0) : false;
  const canStartGame = isOwner && room?.status === 0; // Waiting

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white">Carregando jogo...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  size="sm"
                >
                  ← Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {room ? room.name : `Sala ${roomId}`}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {room ? (isOnlineRoom(room) ? '🌐 Jogo Online' : '🏠 Jogo Presencial') : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!gameState || gameState.session.status === 'waiting' ? (
            /* Game Not Started */
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Jogo não iniciado</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-400">
                    {canStartGame 
                      ? 'Você pode iniciar o jogo quando estiver pronto.'
                      : 'Aguarde o dono da sala iniciar o jogo.'
                    }
                  </p>
                  
                  {canStartGame && (
                    <Button
                      onClick={startGame}
                      disabled={isGameLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isGameLoading ? 'Iniciando...' : '🚀 Iniciar Jogo'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : gameState.session.status === 'finished' ? (
            /* Game Finished */
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">🏁 Jogo Finalizado</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-400">O jogo foi finalizado!</p>
                  <div className="space-y-2">
                    <h3 className="text-white font-medium">Placar Final:</h3>
                    {gameState.scores
                      .sort((a, b) => b.points - a.points)
                      .map((score, index) => (
                        <div key={score.playerId} className="flex justify-between items-center bg-slate-700 p-3 rounded">
                          <span className="text-white">
                            {index === 0 ? '🏆' : `${index + 1}º`} {score.playerName}
                          </span>
                          <span className="text-blue-400 font-bold">{score.points} pontos</span>
                        </div>
                      ))}
                  </div>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Voltar ao Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Game Playing */
            <GameInterface
              roomId={roomId}
              isOnline={room ? isOnlineRoom(room) : true}
              isOwner={isOwner}
              currentUserId={user?.id || 0}
              onSubmitGuess={handleSubmitGuess}
              onAssignPoint={handleAssignPoint}
              onNextScene={handleNextScene}
              onEndGame={handleEndGame}
              gameState={gameState}
              isLoading={isGameLoading}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
