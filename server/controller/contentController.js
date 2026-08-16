import mongoose from "mongoose";
import Content from "../models/Content.js";
import { generateAIContent } from "../services/aiService.js";
import createNotification from "../utils/createNotification.js";


export const generateContent = async (req, res) => {
    try {
        const {
            contentType,
            platform,
            topic,
            writingStyle,
        } = req.body;

        if (!contentType || !platform || !topic || !writingStyle) {
            return res.status(400).json({
                success: false,
                message: "All content fields are required.",
            });
        }

        const generatedContent = await generateAIContent({
            contentType,
            platform,
            topic,
            writingStyle,
        });

        const savedContent = await Content.create({
            user: req.user.id,
            contentType,
            platform,
            topic,
            writingStyle,
            content: generatedContent,
        });
       
        await createNotification({
            user: req.user.id,
            title: "Content Created",
            message: `"${savedContent.topic}" has been generated successfully.`,
            type: "content_created",
        });

        return res.status(200).json({
            success: true,
            message: "Content generated successfully.",
            data: savedContent,
        });
    } catch (error) {
        console.error("Content generation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate content.",
        });
    }
};

export const getUserContent = async (req, res) => {
    try {
        const contents = await Content.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contents,
        });
    } catch (error) {
        console.error("Get content error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch content",
        });
    }
};

export const deleteContent = async (req, res) => {
    try {
        const content = await Content.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Content deleted successfully",
        });
    } catch (error) {
        console.error("Delete content error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete content",
        });
    }
};

export const updateContent = async (req, res) => {
    try {
        const content = await Content.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Content updated successfully",
            data: content,
        });
    } catch (error) {
        console.error("Update content error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update content",
        });
    }
};

export const scheduleContent = async (req, res) => {
    try {
        const { scheduledAt } = req.body;

        if (!scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Scheduled date and time are required",
            });
        }

        const scheduleDate = new Date(scheduledAt);

        if (Number.isNaN(scheduleDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid scheduled date",
            });
        }

        if (scheduleDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Scheduled time must be in the future",
            });
        }

        const content = await Content.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id,
            },
            {
                status: "scheduled",
                scheduledAt: scheduleDate,
            },
            {
                new: true,
                runValidators: true,
            }
        );

       
        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
            });
        }
        await createNotification({
            user: req.user.id,
            title: "Content Scheduled",
            message: `"${content.topic}" has been scheduled successfully.`,
            type: "scheduled",
        });

        return res.status(200).json({
            success: true,
            message: "Content scheduled successfully",
            data: content,
        });
    } catch (error) {
        console.error("Schedule content error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to schedule content",
        });
    }
};

export const getScheduledContent = async (req, res) => {
    try {
        const contents = await Content.find({
            user: req.user.id,
            status: "scheduled",
            scheduledAt: { $ne: null },
        }).sort({ scheduledAt: 1 });

        res.status(200).json({
            success: true,
            data: contents,
        });
    } catch (error) {
        console.error("Get scheduled content error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch scheduled content",
        });
    }
};

export const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { scheduledAt } = req.body;

        if (!scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Scheduled date and time are required",
            });
        }

        const content = await Content.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
            });
        }

        content.scheduledAt = new Date(scheduledAt);
        content.status = "scheduled";

        await content.save();

        await createNotification({
            user: req.user.id,
            title: "Content Rescheduled",
            message: `"${content.topic}" has been rescheduled.`,
            type: "rescheduled",
        });

        res.status(200).json({
            success: true,
            message: "Content rescheduled successfully",
            data: content,
        });
    } catch (error) {
        console.error("Reschedule error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reschedule content",
        });
    }
};

export const cancelSchedule = async (req, res) => {
    try {
        const { id } = req.params;

        const content = await Content.findOne({
            _id: id,
            user: req.user.id,
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found",
            });
        }

        content.status = "draft";
        content.scheduledAt = null;

        await content.save();
        await createNotification({
            user: req.user.id,
            title: "Schedule Cancelled",
            message: `"${content.topic}" has been returned to drafts.`,
            type: "cancelled",
        });
        res.status(200).json({
            success: true,
            message: "Schedule cancelled successfully",
            data: content,
        });
    } catch (error) {
        console.error("Cancel schedule error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to cancel schedule",
        });
    }
};

export const getContentAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const [
            totalContent,
            scheduledContent,
            draftContent,
            publishedContent,
        ] = await Promise.all([
            Content.countDocuments({ user: userId }),
            Content.countDocuments({
                user: userId,
                status: "scheduled",
            }),
            Content.countDocuments({
                user: userId,
                status: "draft",
            }),
            Content.countDocuments({
                user: userId,
                status: "published",
            }),
        ]);

        const platformStats = await Content.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $group: {
                    _id: "$platform",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        const contentTypeStats = await Content.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $group: {
                    _id: "$contentType",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalContent,
                scheduledContent,
                draftContent,
                publishedContent,
                platformStats,
                contentTypeStats,
            },
        });
    } catch (error) {
        console.error("Analytics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load analytics",
        });
    }
};