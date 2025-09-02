'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { RoomCard } from '@/components/game/RoomCard';
import { CreateRoomModal } from '@/components/game/CreateRoomModal';
import { JoinRoomModal } from '@/components/game/JoinRoomModal';
import { Room, CreateRoomData } from '@/types/game';
import { apiRequest, API_CONFIG } from '@/lib/api';

interface RoomStats {
  totalRooms: number;
  activeRooms: number;
  completedRooms: number;
  averagePlayersPerRoom: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStats | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('❌ Token não encontrado no localStorage');
        throw new Error('Token não encontrado');
      }

      console.log('🏠 Carregando salas do usuário...');
      console.log('🔑 Token:', token.substring(0, 20) + '...');

      // Primeiro tentar buscar todas as salas para testar a conexão
      let roomsData;
      try {
        console.log('🔍 Tentando /Rooms/my-rooms...');
        roomsData = await apiRequest('/Rooms/my-rooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.log('❌ Falhou /Rooms/my-rooms, tentando /Rooms...');
        roomsData = await apiRequest('/Rooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      console.log('📋 Salas carregadas - Tipo:', typeof roomsData);
      console.log('📋 Salas carregadas - Dados:', roomsData);
      console.log('📋 É array?', Array.isArray(roomsData));

      // Verificar se roomsData é um array válido
      const validRoomsData = Array.isArray(roomsData) ? roomsData : [];
      console.log('✅ Dados válidos:', validRoomsData.length, 'salas');
      setRooms(validRoomsData);

      // Calcular estatísticas
      const totalRooms = validRoomsData.length;
      const activeRooms = validRoomsData.filter((room: Room) => room.status === 1).length;
      const completedRooms = validRoomsData.filter((room: Room) => room.status === 2).length;
      const averagePlayersPerRoom = totalRooms > 0
        ? validRoomsData.reduce((acc: number, room: Room) => acc + room.currentPlayerCount, 0) / totalRooms
        : 0;

      setStats({
        totalRooms,
        activeRooms,
        completedRooms,
        averagePlayersPerRoom: Math.round(averagePlayersPerRoom * 10) / 10
      });

      console.log('📊 Estatísticas calculadas:', {
        totalRooms,
        activeRooms,
        completedRooms,
        averagePlayersPerRoom
      });

    } catch (error) {
      console.error('❌ Erro ao carregar salas:', error);
      console.error('❌ Tipo do erro:', typeof error);
      console.error('❌ Mensagem:', error instanceof Error ? error.message : 'Erro desconhecido');

      // Em caso de erro, mostrar array vazio
      setRooms([]);
      setStats({
        totalRooms: 0,
        activeRooms: 0,
        completedRooms: 0,
        averagePlayersPerRoom: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (roomData: CreateRoomData) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🏠 Criando nova sala:', roomData);

      const newRoom = await apiRequest('/Rooms', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      console.log('✅ Sala criada:', newRoom);
      setIsCreateModalOpen(false);

      // Recarregar lista de salas
      loadRooms();

    } catch (error) {
      console.error('❌ Erro ao criar sala:', error);
      alert('Erro ao criar sala: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleJoinRoom = async (roomId: number) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🚪 Entrando na sala:', roomId);

      await apiRequest(`/Rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Entrou na sala com sucesso');

      // Recarregar lista de salas
      loadRooms();

    } catch (error) {
      console.error('❌ Erro ao entrar na sala:', error);
      alert('Erro ao entrar na sala: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleLeaveRoom = async (roomId: number) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Confirmar antes de sair
      const confirmLeave = window.confirm('Tem certeza que deseja sair desta sala?');
      if (!confirmLeave) {
        return;
      }

      console.log('🚪 Saindo da sala:', roomId);

      await apiRequest(`/Rooms/${roomId}/leave`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Saiu da sala com sucesso');

      // Recarregar lista de salas
      loadRooms();

      alert('Você saiu da sala com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao sair da sala:', error);

      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Sala não encontrada.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Você não está nesta sala ou não pode sair.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Sem permissão para sair da sala.';
        } else {
          errorMessage = error.message;
        }
      }

      alert('Erro ao sair da sala: ' + errorMessage);
    }
  };

  const handleJoinRoomByCode = async (roomCode: string) => {
    try {
      setIsJoining(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🔑 Entrando na sala com código:', roomCode);

      // Buscar a sala pelo código para obter o roomId
      console.log('🔍 Buscando sala pelo código...');
      const allRooms = await apiRequest('/Rooms', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const targetRoom = allRooms.find((room: Room) => room.roomCode === roomCode);

      if (!targetRoom) {
        throw new Error(`Sala com código "${roomCode}" não encontrada. Verifique se o código está correto.`);
      }

      console.log('✅ Sala encontrada:', targetRoom);

      // Entrar na sala usando o endpoint correto
      console.log(`🚪 Entrando na sala ID ${targetRoom.id}...`);

      const joinResponse = await apiRequest(`/Rooms/${targetRoom.id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomCode }),
      });

      console.log('✅ Entrou na sala com sucesso:', joinResponse);

      setIsJoinModalOpen(false);
      loadRooms();

      alert(`Você entrou na sala "${targetRoom.name}" com sucesso!`);

    } catch (error) {
      console.error('❌ Erro ao entrar na sala:', error);

      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Sala não encontrada. Verifique se o código está correto.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Código inválido ou você já está na sala.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Sala privada ou sem permissão para entrar.';
        } else {
          errorMessage = error.message;
        }
      }

      alert('Erro ao entrar na sala: ' + errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  const handleManageMovies = (roomId: number) => {
    router.push(`/room/${roomId}/movies`);
  };

  const handlePlayGame = (roomId: number) => {
    router.push(`/room/${roomId}/game`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white">Carregando suas salas...</p>
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
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white">TakeCerto</h1>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <span className="text-gray-300 text-sm sm:text-base truncate">
                  Olá, {user?.username || user?.email}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-4">

                  <Button
                    onClick={() => setIsJoinModalOpen(true)}
                    variant="outline"
                    style={{
                      backgroundColor: 'var(--secondary)'
                    }}
                    className="hover:opacity-90 text-white"

                    size="sm"
                  >
                    Entrar em Sala
                  </Button>

                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="outline"
                    style={{
                      backgroundColor: 'var(--laranja-teste)'
                    }}
                    className="hover:opacity-90 text-white"
                    size="sm"
                  >
                    Criar Sala
                  </Button>

                  <Button
                    onClick={loadRooms}
                    variant="outline"
                    style={{
                        backgroundColor: 'var(--info)'   
                    }}
                    className="hover:text-white"
                    size="sm"
                  >
                    🔄 Atualizar
                  </Button>

                  <Button
                    onClick={logout}
                    style={{
                      backgroundColor: 'var(--primary)'
                    }}
                    className="hover:text-white"
                    size="sm"
                  >
                    Sair
                  </Button>

                </div>

                {/* Mobile: Menu hambúrguer */}
                <div className="md:hidden flex items-center space-x-2">
                  <DropdownMenu
                    trigger={
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        size="sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </Button>
                    }
                  >
                    <DropdownMenuItem
                      onClick={() => setIsCreateModalOpen(true)}
                      icon={<span>➕</span>}
                    >
                      Criar Sala
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsJoinModalOpen(true)}
                      icon={<span>🚪</span>}
                    >
                      Entrar em Sala
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={loadRooms}
                      icon={<span>🔄</span>}
                    >
                      Atualizar
                    </DropdownMenuItem>
                    <div className="border-t border-slate-600 my-1"></div>
                    <DropdownMenuItem
                      onClick={logout}
                      icon={<span>🚪</span>}
                      className="text-red-400 hover:bg-red-700"
                    >
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{stats.totalRooms}</p>
                    <p className="text-sm text-gray-400">Total de Salas</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{stats.activeRooms}</p>
                    <p className="text-sm text-gray-400">Salas Ativas</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{stats.completedRooms}</p>
                    <p className="text-sm text-gray-400">Finalizadas</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{stats.averagePlayersPerRoom}</p>
                    <p className="text-sm text-gray-400">Média Jogadores</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Minhas Salas</h2>
            </div>

            {rooms.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400 mb-4">Você ainda não tem salas</p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Criar Primeira Sala
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onJoin={handleJoinRoom}
                    onLeave={handleLeaveRoom}
                    onManageMovies={handleManageMovies}
                    onPlayGame={handlePlayGame}
                    currentUserId={user?.id || 0}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateRoom}
        />

        <JoinRoomModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onSubmit={handleJoinRoomByCode}
          isLoading={isJoining}
        />
      </div>
    </ProtectedRoute>
  );
}
