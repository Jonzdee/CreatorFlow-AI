import Notification from "../models/Notification.js";

const createNotification = async ({
    user,
    title,
    message,
    type,
}) => {
    try {
        const notification = await Notification.create({
            user,
            title,
            message,
            type,
        });

        console.log("🔔 Notification created:", notification);

        return notification;
    } catch (error) {
        console.error("❌ Failed to create notification:", error);

        return null;
    }
};

export default createNotification;