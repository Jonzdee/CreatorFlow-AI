import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id,
        })
            .sort({ createdAt: -1 })
            .limit(30);

        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            read: false,
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Notification error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load notifications",
        });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id,
            },
            {
                read: true,
            },
            {
                new: true,
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Mark notification error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};