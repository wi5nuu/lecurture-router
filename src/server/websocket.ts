import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyAccessToken } from '../lib/jwt';
import { logger } from '../lib/logger';
import { pubsub } from '../lib/redis';
import prisma from '../lib/db';

const PORT = parseInt(process.env.WS_PORT || '3001');

const httpServer = createServer();

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Store user socket mappings
const userSockets = new Map<string, Set<string>>();

// Authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return next(new Error('Invalid or expired token'));
    }

    // Attach user info to socket
    socket.data.userId = payload.userId;
    socket.data.email = payload.email;
    socket.data.role = payload.role;

    logger.info('WebSocket authentication successful', { userId: payload.userId, socketId: socket.id });
    next();
  } catch (error) {
    logger.error('WebSocket authentication failed', error);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  
  logger.info('Client connected', { userId, socketId: socket.id });

  // Track user's socket
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId)!.add(socket.id);

  // Join user's personal room
  socket.join(`user:${userId}`);

  // Send connection confirmation
  socket.emit('connected', {
    message: 'Connected to WebSocket server',
    userId,
    timestamp: new Date().toISOString(),
  });

  // Handle subscription to channels
  socket.on('subscribe', (channel: string) => {
    socket.join(channel);
    logger.debug('Client subscribed to channel', { userId, socketId: socket.id, channel });
    socket.emit('subscribed', { channel });
  });

  // Handle unsubscription
  socket.on('unsubscribe', (channel: string) => {
    socket.leave(channel);
    logger.debug('Client unsubscribed from channel', { userId, socketId: socket.id, channel });
    socket.emit('unsubscribed', { channel });
  });

  // Handle mark notification as read
  socket.on('notification:read', async (notificationId: string) => {
    try {
      await prisma.notification.update({
        where: { id: notificationId, userId },
        data: { isRead: true, readAt: new Date() },
      });

      socket.emit('notification:read:success', { notificationId });
    } catch (error) {
      logger.error('Failed to mark notification as read', error, { userId, notificationId });
      socket.emit('notification:read:error', { notificationId, error: 'Failed to mark as read' });
    }
  });

  // Handle ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    logger.info('Client disconnected', { userId, socketId: socket.id, reason });

    const sockets = userSockets.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSockets.delete(userId);
      }
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    logger.error('Socket error', error, { userId, socketId: socket.id });
  });
});

// Redis pub/sub integration for multi-instance support
const subscriber = pubsub.subscribe('notifications', (message) => {
  const { userId, type, data } = message;

  // Send to specific user
  if (userId) {
    io.to(`user:${userId}`).emit(type, data);
  } else {
    // Broadcast to all
    io.emit(type, data);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing WebSocket server...');
  subscriber.disconnect();
  io.close(() => {
    logger.info('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, closing WebSocket server...');
  subscriber.disconnect();
  io.close(() => {
    logger.info('WebSocket server closed');
    process.exit(0);
  });
});

// Start server
httpServer.listen(PORT, () => {
  logger.info(`WebSocket server running on port ${PORT}`);
  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
});

// Export for programmatic access
export { io, userSockets };
