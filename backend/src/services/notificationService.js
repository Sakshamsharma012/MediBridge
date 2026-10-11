import { prisma } from '../config/db.js';

export const sendNotification = async ({ userId, title, message, type = 'SYSTEM', link = null }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};
