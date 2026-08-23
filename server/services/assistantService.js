import { generateAssistantResponse } from "./geminiService.js";
import Content from "../models/Content.js";

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