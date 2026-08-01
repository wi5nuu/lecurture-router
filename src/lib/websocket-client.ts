import { io as ioClient, Socket } from 'socket.io-client';
import { logger } from './logger';

let socket: Socket | null = null;

export interface WebSocketConfig {
  url?: string;
  token: string;
  autoConnect?: boolean;
}

export function initWebSocket(config: WebSocketConfig): Socket {
  if (socket?.connected) {
    logger.warn('WebSocket already connected');
    return socket;
  }

  const url = config.url || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

  socket = ioClient(url, {
    auth: {
      token: config.token,
    },
    autoConnect: config.autoConnect !== false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Connection events
  socket.on('connect', () => {
    logger.info('WebSocket connected', { socketId: socket!.id });
  });

  socket.on('connected', (data) => {
    logger.info('WebSocket connection confirmed', data);
  });

  socket.on('disconnect', (reason) => {
    logger.warn('WebSocket disconnected', { reason });
  });

  socket.on('connect_error', (error) => {
    logger.error('WebSocket connection error', error);
  });

  socket.on('reconnect', (attemptNumber) => {
    logger.info('WebSocket reconnected', { attemptNumber });
  });

  socket.on('reconnect_failed', () => {
    logger.error('WebSocket reconnection failed');
  });

  return socket;
}

export function getWebSocket(): Socket | null {
  return socket;
}

export function disconnectWebSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    logger.info('WebSocket disconnected manually');
  }
}

// Subscribe to a channel
export function subscribe(channel: string): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.emit('subscribe', channel);
}

// Unsubscribe from a channel
export function unsubscribe(channel: string): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.emit('unsubscribe', channel);
}

// Mark notification as read
export function markNotificationAsRead(notificationId: string): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.emit('notification:read', notificationId);
}

// Event listeners
export function onNotification(callback: (data: any) => void): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.on('notification', callback);
}

export function onMaterialUpdate(callback: (data: any) => void): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.on('material:update', callback);
}

export function onNewMaterial(callback: (data: any) => void): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.on('material:new', callback);
}

export function offNotification(callback: (data: any) => void): void {
  socket?.off('notification', callback);
}

export function offMaterialUpdate(callback: (data: any) => void): void {
  socket?.off('material:update', callback);
}

export function offNewMaterial(callback: (data: any) => void): void {
  socket?.off('material:new', callback);
}

// Ping/pong for connection health check
export function ping(): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.emit('ping');
}

export function onPong(callback: (data: any) => void): void {
  if (!socket) {
    logger.error('WebSocket not initialized');
    return;
  }

  socket.on('pong', callback);
}
