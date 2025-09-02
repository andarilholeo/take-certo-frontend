'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { MovieCard } from '@/components/game/MovieCard';
import { SubmitMovieModal } from '@/components/game/SubmitMovieModal';
import { UploadSceneModal } from '@/components/game/UploadSceneModal';
import { MovieScenesModal } from '@/components/game/MovieScenesModal';
import { Movie, Room, CreateMovieData, MyMoviesResponse, DeleteSceneData, ReorderScenesData } from '@/types/game';
import { apiRequest } from '@/lib/api';

export default function RoomMoviesPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const roomId = parseInt(params.id as string);

  const [room, setRoom] = useState<Room | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isScenesModalOpen, setIsScenesModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiMessage, setApiMessage] = useState<string>('');

  useEffect(() => {
    loadRoomData();
    loadMovies();
  }, [roomId]);

  // Atualizar filme selecionado quando a lista de filmes mudar
  useEffect(() => {
    if (selectedMovie && movies.length > 0) {
      const updatedMovie = movies.find(m => m.id === selectedMovie.id);
      if (updatedMovie) {
        setSelectedMovie(updatedMovie);
        console.log('🔄 Filme selecionado atualizado:', updatedMovie);
      } else {
        // Filme foi deletado ou não existe mais
        setSelectedMovie(null);
        setIsScenesModalOpen(false);
        console.log('⚠️ Filme selecionado não encontrado, fechando modal');
      }
    }
  }, [movies, selectedMovie?.id]);

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

  const loadMovies = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🎬 Carregando meus filmes da sala:', roomId);

      const moviesData: MyMoviesResponse = await apiRequest(`/Game/rooms/${roomId}/my-movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('📋 Resposta da API:', moviesData);

      // A API retorna um objeto com a propriedade 'movies' que contém o array
      const moviesArray = moviesData?.movies || [];

      console.log('📋 Array de filmes extraído:', moviesArray);
      console.log('📋 Quantidade de filmes:', moviesArray.length);

      if (Array.isArray(moviesArray)) {
        setMovies(moviesArray);
        setApiMessage(moviesData.message || '');
        console.log('✅ Filmes carregados com sucesso:', moviesArray.length, 'filmes');
      } else {
        console.warn('⚠️ Propriedade movies não é um array:', moviesArray);
        setMovies([]);
        setApiMessage('');
      }

    } catch (error) {
      console.error('❌ Erro ao carregar filmes:', error);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMovie = async (movieData: CreateMovieData) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🎬 Submetendo filme:', movieData);
      
      const newMovie = await apiRequest(`/Game/rooms/${roomId}/movies`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(movieData),
      });

      console.log('✅ Filme submetido:', newMovie);
      setIsSubmitModalOpen(false);
      loadMovies(); // Recarregar lista
      
      alert('Filme submetido com sucesso! Agora você pode enviar as cenas.');
      
    } catch (error) {
      console.error('❌ Erro ao submeter filme:', error);
      alert('Erro ao submeter filme: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadScene = async (movieId: number, order: number, description: string, imageFile: File) => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('📸 Enviando cena:', { movieId, order, description, fileName: imageFile.name, fileSize: imageFile.size });

      // Criar FormData para upload de arquivo
      const formData = new FormData();
      formData.append('movieId', movieId.toString());
      formData.append('order', order.toString());
      formData.append('description', description);
      formData.append('imageFile', imageFile);

      // Log do FormData para debug
      console.log('📋 FormData criado:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5134/api'}/Game/scenes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Não definir Content-Type para FormData - o browser define automaticamente
        },
        body: formData,
      });

      console.log('📡 Status da resposta:', response.status);
      console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro da API:', errorText);
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      const sceneData = await response.json();
      console.log('✅ Cena enviada com sucesso:', sceneData);

      // Fechar modal e limpar estado apenas em caso de sucesso
      setIsUploadModalOpen(false);
      setSelectedMovie(null);

      // Recarregar lista de filmes
      await loadMovies();

      // Feedback de sucesso
      alert(`✅ Cena ${order} enviada com sucesso!\n\n📸 ${description}`);

    } catch (error) {
      console.error('❌ Erro ao enviar cena:', error);

      // Mostrar erro detalhado
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro ao enviar cena:\n\n${errorMessage}\n\nTente novamente.`);

      // Não fechar o modal em caso de erro para permitir nova tentativa
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadSceneClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsUploadModalOpen(true);
  };

  const handleViewDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsScenesModalOpen(true);
  };

  const handleDeleteScene = async (sceneId: number) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🗑️ Deletando cena:', sceneId);

      const deleteData: DeleteSceneData = { sceneId };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5134/api'}/Game/scenes/${sceneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      console.log('✅ Cena deletada com sucesso');

      // Recarregar lista de filmes
      await loadMovies();

      alert('✅ Cena deletada com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao deletar cena:', error);
      alert(`❌ Erro ao deletar cena:\n\n${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorderScenes = async (movieId: number, sceneOrders: { sceneId: number; newOrder: number }[]) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('🔄 Reordenando cenas:', { movieId, sceneOrders });

      const reorderData: ReorderScenesData = { movieId, sceneOrders };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5134/api'}/Game/scenes/reorder`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reorderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      console.log('✅ Cenas reordenadas com sucesso');

      // Recarregar lista de filmes
      await loadMovies();

    } catch (error) {
      console.error('❌ Erro ao reordenar cenas:', error);
      alert(`❌ Erro ao reordenar cenas:\n\n${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const userMovies = Array.isArray(movies) ? movies : [];
  const canSubmitMore = room ? userMovies.length < room.moviesPerPlayer : false;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white">Carregando filmes...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <header className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-700 hover:text-white"
                  size="sm"
                >
                  ← Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {room ? room.name : `Sala ${roomId}`}
                  </h1>
                  <p className="text-gray-400 text-sm">Gerenciar Filmes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">

              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {room && (
            <Card className="bg-slate-800 border-slate-700 mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Filmes por jogador:</span>
                    <span className="text-white ml-1">{room.moviesPerPlayer}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cenas por filme:</span>
                    <span className="text-white ml-1">{room.scenesPerMovie}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Seus filmes:</span>
                    <span className="text-white ml-1">{userMovies.length}/{room.moviesPerPlayer}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total de filmes:</span>
                    <span className="text-white ml-1">{movies.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {apiMessage && (
            <Card className="bg-blue-900/20 border-blue-700">
              <CardContent className="p-4">
                <p className="text-blue-200 text-sm">💡 {apiMessage}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Meus Filmes</h2>
              {canSubmitMore && (
                <Button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  🎬 Submeter Filme
                </Button>
              )}
            </div>

            {userMovies.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400 mb-4">Você ainda não submeteu nenhum filme</p>
                  {canSubmitMore && (
                    <Button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3"
                    >
                      🎬 Submeter Primeiro Filme
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(userMovies) && userMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onUploadScene={handleUploadSceneClick}
                    onViewDetails={handleViewDetails}
                    currentUserId={user?.id || 0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info sobre limitação */}
          {!canSubmitMore && userMovies.length > 0 && (
            <div className="mt-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400">
                    ✅ Você atingiu o limite de {room?.moviesPerPlayer} filmes para esta sala.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Continue enviando as cenas dos seus filmes para completá-los.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Modals */}
        <SubmitMovieModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={handleSubmitMovie}
          isLoading={isSubmitting}
        />

        <UploadSceneModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadScene}
          movie={selectedMovie}
          isLoading={isUploading}
        />

        <MovieScenesModal
          isOpen={isScenesModalOpen}
          onClose={() => setIsScenesModalOpen(false)}
          movie={selectedMovie}
          currentUserId={user?.id || 0}
          onDeleteScene={handleDeleteScene}
          onReorderScenes={handleReorderScenes}
          isLoading={isDeleting}
        />
      </div>
    </ProtectedRoute>
  );
}
