// Tipos baseados na API real do TakeCerto
export interface Player {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
}

export interface RoomPlayer {
  id: number;
  player: Player;
  joinedAt: string;
  isReady: boolean;
  hasSubmittedMovies: boolean;
}

export interface Room {
  id: number;
  name: string;
  description: string;
  maxPlayers: number;
  moviesPerPlayer: number;
  scenesPerMovie: number;
  status: number; // 0: Waiting, 1: InProgress, 2: Finished
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  roomCode: string;
  isPrivate: boolean;
  createdBy: Player;
  players: RoomPlayer[];
  currentPlayerCount: number;
  canJoin: boolean;
}

export interface LoginResponse {
  token: string;
  player: Player;
  expiresAt: string;
}

// Tipos para filmes e cenas
export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  submittedAt: string;
  submittedBy: Player;
  roomId: number;
  scenes: Scene[];
  hasAllScenes: boolean;
}

export interface Scene {
  id: number;
  movieId: number;
  imageUrl: string;
  order: number;
  description: string;
  uploadedAt: string;
}

export interface CreateMovieData {
  title: string;
  year: number;
  genre: string;
}

export interface CreateSceneData {
  movieId: number;
  order: number;
  description: string;
  imageFile: File;
}

// Resposta da API para filmes do usuário
export interface MyMoviesResponse {
  playerId: number;
  roomId: number;
  movies: Movie[];
  message: string;
  instruction: string;
}

// Dados para deletar cena
export interface DeleteSceneData {
  sceneId: number;
}

// Dados para reordenar cenas
export interface ReorderScenesData {
  movieId: number;
  sceneOrders: { sceneId: number; newOrder: number }[];
}

export interface GameSettings {
  isPublic: boolean;
  allowSpectators: boolean;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  categories: string[];
  rules?: string;
}

export interface GameStats {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  totalScore: number;
  averageScore: number;
  favoriteCategory: string;
}

export interface CreateGameData {
  title: string;
  description: string;
  gameType: Game['gameType'];
  maxParticipants?: number;
  settings: Omit<GameSettings, 'categories'> & {
    categories: string[];
  };
}

export interface JoinGameData {
  gameId: string;
  password?: string;
}
