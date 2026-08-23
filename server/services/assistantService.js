import {
    generateAssistantResponse,
    generateDashboardGreeting as generateDashboardGreetingAI,
} from "./geminiService.js";

import Content from "../models/Content.js";


// ============================================================
// CREATOR ASSISTANT CHAT
// ============================================================

export const getAssistantResponse = async ({
    userId,
    message,
}) => {
    const recentContent = await Content.find({
        user: userId,
    })
        .sort({ createdAt: -1 })
        .limit(10)
        .select(
            "title topic contentType platform writingStyle status createdAt"
        )
        .lean();

    const analytics = {
        totalContent: await Content.countDocuments({
            user: userId,
        }),

        publishedContent: await Content.countDocuments({
            user: userId,
            status: "published",
        }),

        scheduledContent: await Content.countDocuments({
            user: userId,
            status: "scheduled",
        }),

        draftContent: await Content.countDocuments({
            user: userId,
            status: "draft",
        }),
    };

    return generateAssistantResponse({
        message,
        userContext: {
            analytics,
            recentContent,
        },
    });
};


// ============================================================
// DASHBOARD AI GREETING
// ============================================================

export const generateDashboardGreeting = async ({
    userId,
    name,
}) => {
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

    return generateDashboardGreetingAI({
        name: name || "Creator",

        analytics: {
            totalContent,
            publishedContent,
            scheduledContent,
            draftContent,
        },

        recentContent,
    });
};