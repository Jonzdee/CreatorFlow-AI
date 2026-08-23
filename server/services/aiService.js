import { generateWithGemini } from "./geminiService.js";

export const generateAIContent = async ({
    contentType,
    platform,
    topic,
    writingStyle,
}) => {
    const result = await generateWithGemini({
        contentType,
        platform,
        topic,
        writingStyle,
    });

    return result;
};