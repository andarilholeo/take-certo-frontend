/**
 * Utilitários para trabalhar com salas
 */

import { Room } from '@/types/game';

/**
 * Verifica se uma sala é online
 */
export function isOnlineRoom(room: Room): boolean {
  return room.type === 0;
}

/**
 * Verifica se uma sala é presencial (offline)
 */
export function isOfflineRoom(room: Room): boolean {
  return room.type === 1;
}

/**
 * Retorna o texto do tipo da sala
 */
export function getRoomTypeText(room: Room): string {
  return room.type === 0 ? '🌐 Online' : '🏠 Presencial';
}

/**
 * Retorna a descrição do tipo da sala
 */
export function getRoomTypeDescription(room: Room): string {
  return room.type === 0 
    ? 'Jogadores fazem palpites digitalmente através da plataforma'
    : 'Jogadores estão juntos fisicamente, dono controla pontuação';
}

/**
 * Constantes para tipos de sala
 */
export const ROOM_TYPES = {
  ONLINE: 0,
  OFFLINE: 1
} as const;

/**
 * Constantes para status de sala
 */
export const ROOM_STATUS = {
  WAITING: 0,
  IN_PROGRESS: 1,
  FINISHED: 2
} as const;

/**
 * Retorna o texto do status da sala
 */
export function getRoomStatusText(status: number): string {
  switch (status) {
    case ROOM_STATUS.WAITING:
      return 'Aguardando';
    case ROOM_STATUS.IN_PROGRESS:
      return 'Em Andamento';
    case ROOM_STATUS.FINISHED:
      return 'Finalizada';
    default:
      return 'Desconhecido';
  }
}

/**
 * Verifica se o usuário pode entrar na sala
 */
export function canJoinRoom(room: Room, currentUserId: number): boolean {
  const isParticipant = room.players.some(p => p.player.id === currentUserId);
  return !isParticipant && room.canJoin && room.status === ROOM_STATUS.WAITING;
}

/**
 * Verifica se o usuário é participante da sala
 */
export function isRoomParticipant(room: Room, currentUserId: number): boolean {
  return room.players.some(p => p.player.id === currentUserId);
}

/**
 * Verifica se o usuário é dono da sala
 */
export function isRoomOwner(room: Room, currentUserId: number): boolean {
  return room.createdBy.id === currentUserId;
}
