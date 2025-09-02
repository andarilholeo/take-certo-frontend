'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GameState, GameScore, SubmitGuessData, AssignPointData } from '@/types/game';

interface GameInterfaceProps {
  roomId: number;
  isOnline: boolean;
  isOwner: boolean;
  currentUserId: number;
  onSubmitGuess: (data: SubmitGuessData) => void;
  onAssignPoint: (data: AssignPointData) => void;
  onNextScene: () => void;
  onEndGame: () => void;
  gameState: GameState | null;
  isLoading?: boolean;
}

export function GameInterface({
  roomId,
  isOnline,
  isOwner,
  currentUserId,
  onSubmitGuess,
  onAssignPoint,
  onNextScene,
  onEndGame,
  gameState,
  isLoading = false
}: GameInterfaceProps) {
  const [guess, setGuess] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [showScores, setShowScores] = useState(false);

  if (!gameState) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Carregando jogo...</p>
      </div>
    );
  }

  const { session, currentMovie, currentScene, playerGuesses, scores, isMyTurn, canGuess, hasGuessedCurrentScene } = gameState;

  const handleSubmitGuess = () => {
    if (!currentMovie || !guess.trim()) return;

    const guessData: SubmitGuessData = {
      gameSessionId: session.id,
      movieId: currentMovie.id,
      sceneIndex: session.currentSceneIndex,
      guess: guess.trim(),
      isSkip: false
    };

    onSubmitGuess(guessData);
    setGuess('');
  };

  const handleSkip = () => {
    if (!currentMovie) return;

    const skipData: SubmitGuessData = {
      gameSessionId: session.id,
      movieId: currentMovie.id,
      sceneIndex: session.currentSceneIndex,
      guess: '',
      isSkip: true
    };

    onSubmitGuess(skipData);
  };

  const handleAssignPoint = (playerId: number) => {
    if (!currentMovie) return;

    const pointData: AssignPointData = {
      gameSessionId: session.id,
      playerId,
      movieId: currentMovie.id,
      points: 1
    };

    onAssignPoint(pointData);
    setSelectedPlayerId(null);
  };

  const currentSceneGuesses = playerGuesses.filter(g => 
    g.movieId === currentMovie?.id && g.sceneIndex === session.currentSceneIndex
  );

  const allPlayersGuessed = scores.length === currentSceneGuesses.length;

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">
                {currentMovie?.title} ({currentMovie?.year})
              </CardTitle>
              <p className="text-gray-400">
                Cena {session.currentSceneIndex + 1} de {currentMovie?.scenes.length}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowScores(!showScores)}
                className="border-blue-600 text-blue-400 hover:bg-blue-700"
              >
                {showScores ? 'Ocultar' : 'Ver'} Placar
              </Button>
              {isOwner && (
                <Button
                  variant="outline"
                  onClick={onEndGame}
                  className="border-red-600 text-red-400 hover:bg-red-700"
                >
                  Encerrar Jogo
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Scores */}
      {showScores && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Placar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scores.map((score) => (
                <div key={score.playerId} className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{score.playerName}</span>
                    <span className="text-blue-400 font-bold">{score.points}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {score.correctGuesses}/{score.totalGuesses} acertos
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Scene */}
      {currentScene && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden max-w-2xl mx-auto">
                <img
                  src={currentScene.imageUrl}
                  alt={`Cena ${session.currentSceneIndex + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
              <p className="text-gray-400 text-sm">{currentScene.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Controls */}
      {isOnline ? (
        /* Online Mode */
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            {canGuess && !hasGuessedCurrentScene ? (
              <div className="space-y-4">
                <h3 className="text-white font-medium">Qual é o filme?</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite o nome do filme..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitGuess()}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSubmitGuess}
                    disabled={!guess.trim() || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Enviar
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    disabled={isLoading}
                    className="border-yellow-600 text-yellow-400 hover:bg-yellow-700"
                  >
                    Pular
                  </Button>
                </div>
              </div>
            ) : hasGuessedCurrentScene ? (
              <div className="text-center py-4">
                <p className="text-green-400">✅ Você já fez seu palpite para esta cena</p>
                <p className="text-gray-400 text-sm mt-2">
                  Aguardando outros jogadores...
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">Aguardando sua vez...</p>
              </div>
            )}

            {/* Current Guesses */}
            {currentSceneGuesses.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-600">
                <h4 className="text-white font-medium mb-3">Palpites desta cena:</h4>
                <div className="space-y-2">
                  {currentSceneGuesses.map((guess) => (
                    <div key={guess.id} className="flex justify-between items-center bg-slate-700 p-2 rounded">
                      <span className="text-gray-300">{guess.playerId}</span>
                      <span className={`text-sm ${guess.isSkip ? 'text-yellow-400' : guess.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {guess.isSkip ? 'Pulou' : guess.guess}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Scene Button */}
            {isOwner && allPlayersGuessed && (
              <div className="mt-6 text-center">
                <Button
                  onClick={onNextScene}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  Próxima Cena
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Offline Mode */
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            {isOwner ? (
              <div className="space-y-4">
                <h3 className="text-white font-medium">Controle do Jogo (Modo Presencial)</h3>
                <p className="text-gray-400 text-sm">
                  Mostre a cena para os jogadores. Quando alguém acertar o filme, atribua o ponto:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {scores.map((score) => (
                    <Button
                      key={score.playerId}
                      onClick={() => handleAssignPoint(score.playerId)}
                      variant="outline"
                      className="border-green-600 text-green-400 hover:bg-green-700 hover:text-white p-4 h-auto"
                      disabled={isLoading}
                    >
                      <div className="text-center">
                        <div className="font-medium">{score.playerName}</div>
                        <div className="text-xs opacity-75">{score.points} pontos</div>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <Button
                    onClick={onNextScene}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    Próxima Cena
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  🏠 Modo Presencial - Aguarde o dono da sala controlar o jogo
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
