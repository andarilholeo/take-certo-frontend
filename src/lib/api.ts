export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5134/api',
  endpoints: {
    auth: {
      login: process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT || '/auth/login',
      register: process.env.NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT || '/auth/register',
      logout: process.env.NEXT_PUBLIC_AUTH_LOGOUT_ENDPOINT || '/auth/logout',
    },
    rooms: {
      list: '/Rooms',
      myRooms: '/Rooms/my-rooms',
      create: '/Rooms',
      join: (roomId: number) => `/Rooms/${roomId}/join`,
      leave: (roomId: number) => `/Rooms/${roomId}/leave`,
      details: (roomId: number) => `/Rooms/${roomId}`,
    },
    movies: {
      myMovies: (roomId: number) => `/Game/rooms/${roomId}/my-movies`,
      create: (roomId: number) => `/Game/rooms/${roomId}/movies`,
      details: (movieId: number) => `/Game/movies/${movieId}`,
    },
    scenes: {
      create: '/Game/scenes',
      list: (movieId: number) => `/Game/movies/${movieId}/scenes`,
    },
  },
};

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  console.log('🔗 API Request:', {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  });

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Success Data:', data);
    return data;

  } catch (error) {
    console.error('🚨 API Request Failed:', {
      url,
      error: error.message,
      type: error.name,
      stack: error.stack
    });

    // Melhorar mensagem de erro para o usuário
    if (error.message === 'Failed to fetch') {
      throw new Error(`Não foi possível conectar com o servidor em ${API_CONFIG.baseURL}. Verifique se o backend está rodando.`);
    }

    throw error;
  }
}