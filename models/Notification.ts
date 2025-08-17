import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['task', 'reminder', 'notification'],
        default: 'notification'
    },
    read: {
        type: Boolean,
        default: false
    }
});

    const Notification = mongoose.model('Notification', notificationSchema);
    export default Notification;