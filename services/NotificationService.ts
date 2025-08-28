import Notification from "../models/Notification.js";
import {io} from "../server.js"
interface NotificationServiceProps {
    user: string;
    message: string;
    type: string;
}

class NotificationService {
    user: string;
    message: string;
    type: string;
    constructor({user, message, type}: NotificationServiceProps) {
        this.type = type;
        this.message = message;
        this.user = user;
    }
    
    async createNotification() {
        try {
            const notification = new Notification({
                user: this.user,
                message: this.message,
                type: this.type,
                read: false
            });
            await notification.save();
            io.to(this.user).emit("notification", notification);
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Failed to create notification');
        }
    }

    static async getNotifications(user: string) {
        try {
            const notifications = await Notification.find({user: user}).sort({ createdAt: -1 });
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw new Error('Failed to fetch notifications');
        }
    }

    async readNotification(id: string) {
        try {
            const notification = await Notification.findById(id);
            if (!notification) {
                throw new Error('Notification not found');
            }
            notification.read = true;
            await notification.save();
            return notification;
        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            throw new Error('Failed to update notification status');
        }
    }
    
    async deleteNotification(id: string) {
        try {
            const result = await Notification.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Notification not found');
            }
            return { success: true, message: 'Notification deleted successfully' };
        } catch (error) {
            console.error(`Error deleting notification ${id}:`, error);
            throw new Error('Failed to delete notification');
        }
    }
    
    static async clearNotifications(user: string) {
        try {
            const result = await Notification.deleteMany({user: user});
            return { 
                success: true, 
                message: `Cleared ${result.deletedCount} notifications`,
                count: result.deletedCount
            };
        } catch (error) {
            console.error('Error clearing notifications:', error);
            throw new Error('Failed to clear notifications');
        }
    }
    static async markAllAsRead(user: string) {
        try {
            const result = await Notification.updateMany({user: user}, {read: true});
            return { 
                success: true, 
                message: `Marked ${result.modifiedCount} notifications as read`,
                count: result.modifiedCount
            };
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            throw new Error('Failed to mark notifications as read');
        }
    }
   
}

export default NotificationService;
