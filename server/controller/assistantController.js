import Content from "../models/Content.js";
import { getAssistantResponse, generateDashboardGreeting } from "../services/assistantService.js";

export const assistantChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Assistant message is required.",
            });
        }

        const response = await getAssistantResponse({
            userId: req.user.id,
            message: message.trim(),
        });

        return res.status(200).json({
            success: true,
            message: "Assistant response generated successfully.",
            data: response,
        });
    } catch (error) {
        console.error("Assistant controller error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to generate assistant response.",
        });
    }
};
export const getDashboardGreeting = async (req, res) => {
    try {
        const userId = req.user.id;

        const recentContent = await Content.find({
            user: userId,
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "title topic contentType platform writingStyle status createdAt"
            )
            .lean();

        const [
            totalContent,
            publishedContent,
            scheduledContent,
            draftContent,
        ] = await Promise.all([
            Content.countDocuments({
                user: userId,
            }),

            Content.countDocuments({
                user: userId,
                status: "published",
            }),

            Content.countDocuments({
                user: userId,
                status: "scheduled",
            }),

            Content.countDocuments({
                user: userId,
                status: "draft",
            }),
        ]);

        const user = req.user;

        const greeting = await generateDashboardGreeting({
            name: user?.name || "Creator",

            analytics: {
                totalContent,
                publishedContent,
                scheduledContent,
                draftContent,
            },

            recentContent,
        });

        return res.status(200).json({
            success: true,
            data: greeting,
        });
    } catch (error) {
        console.error("Dashboard greeting error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to generate dashboard greeting.",
        });
    }
};