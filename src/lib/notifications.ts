import { pubsub } from './redis';
import prisma from './db';
import { logger } from './logger';
import { sendNotificationEmail } from './email';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  metadata?: Record<string, any>;
  sendEmail?: boolean;
}

// Create and send notification
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  try {
    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        link: payload.link || null,
        metadata: payload.metadata || null,
      },
    });

    // Publish to Redis for real-time delivery
    await pubsub.publish('notifications', {
      userId: payload.userId,
      type: 'notification',
      data: notification,
    });

    // Send email if requested
    if (payload.sendEmail) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { email: true, firstName: true },
      });

      if (user) {
        await sendNotificationEmail(
          user.email,
          user.firstName,
          payload.title,
          payload.message
        );
      }
    }

    logger.info('Notification sent', { userId: payload.userId, notificationId: notification.id });
  } catch (error) {
    logger.error('Failed to send notification', error, { userId: payload.userId });
    throw error;
  }
}

// Send notification to multiple users
export async function sendBulkNotification(
  userIds: string[],
  notification: Omit<NotificationPayload, 'userId'>
): Promise<void> {
  try {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        sendNotification({ ...notification, userId })
      )
    );

    logger.info('Bulk notification sent', { userCount: userIds.length });
  } catch (error) {
    logger.error('Failed to send bulk notification', error);
    throw error;
  }
}

// Broadcast to all users
export async function broadcastNotification(
  notification: Omit<NotificationPayload, 'userId'>
): Promise<void> {
  try {
    // Get all active users
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    await sendBulkNotification(
      users.map((u) => u.id),
      notification
    );

    logger.info('Broadcast notification sent', { userCount: users.length });
  } catch (error) {
    logger.error('Failed to broadcast notification', error);
    throw error;
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    logger.info('All notifications marked as read', { userId });
  } catch (error) {
    logger.error('Failed to mark all notifications as read', error, { userId });
    throw error;
  }
}

// Get unread notification count
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  } catch (error) {
    logger.error('Failed to get unread notification count', error, { userId });
    return 0;
  }
}

// Material update notification
export async function notifyMaterialUpdate(materialId: string): Promise<void> {
  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: { provider: true, category: true },
    });

    if (!material) return;

    // Find users who bookmarked this material
    const bookmarks = await prisma.bookmark.findMany({
      where: { materialId },
      include: { user: true },
    });

    // Send notification to each user
    await Promise.all(
      bookmarks.map((bookmark) =>
        sendNotification({
          userId: bookmark.userId,
          title: 'Material Updated',
          message: `"${material.title}" has been updated`,
          type: 'info',
          link: `/materials/${materialId}`,
          metadata: { materialId, materialTitle: material.title },
        })
      )
    );

    // Broadcast update event
    await pubsub.publish('notifications', {
      userId: null, // broadcast to all
      type: 'material:update',
      data: { materialId, material },
    });

    logger.info('Material update notification sent', { materialId, userCount: bookmarks.length });
  } catch (error) {
    logger.error('Failed to send material update notification', error, { materialId });
  }
}

// New material notification
export async function notifyNewMaterial(materialId: string): Promise<void> {
  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: { provider: true, category: true },
    });

    if (!material) return;

    // Broadcast new material event
    await pubsub.publish('notifications', {
      userId: null, // broadcast to all
      type: 'material:new',
      data: { materialId, material },
    });

    logger.info('New material notification sent', { materialId });
  } catch (error) {
    logger.error('Failed to send new material notification', error, { materialId });
  }
}
