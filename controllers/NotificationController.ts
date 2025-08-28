 import { Request, Response } from 'express';
import NotificationService from '../services/NotificationService.js';


export const getNotifications = async (req:  Request, res: Response) => {
    try {
        const notifications = await NotificationService.getNotifications(req.user.id);
        return res.status(200).json(notifications);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Failed to fetch notifications' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
       const result = await NotificationService.markAllAsRead(req.user.id);
       return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Failed to update notification' });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notifications = await NotificationService.getNotifications(req.user.id);
        const targetNotification = notifications.find((n: any) => n._id.toString() === id);
        
        if (!targetNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        const notificationService = new NotificationService({
            user: targetNotification.user.toString(),
            message: targetNotification.message,
            type: targetNotification.type,
        });
        
        await notificationService.deleteNotification(id);
        return res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Failed to delete notification' });
    }
};

export const clearAllNotifications = async (req: Request, res: Response) => {
    try {
        const result = await NotificationService.clearNotifications(req.user.id);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message || 'Failed to clear notifications' });
    }
};
