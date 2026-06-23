import Notification from '../models/Notification.js';

export async function getNotifications(req, res, next) {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(req, res, next) {
  try {
    const notif = await Notification.findById(req.params.id);

    if (!notif) {
      const error = new Error('Notification not found');
      error.statusCode = 404;
      throw error;
    }

    if (String(notif.userId) !== String(req.user._id)) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    notif.isRead = true;
    await notif.save();

    res.status(200).json({
      success: true,
      notification: notif
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
}
