import { generateAIContent } from "../services/aiService.js";

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

        const content = await generateAIContent({
            contentType,
            platform,
            topic,
            writingStyle,
        });

        return res.status(200).json({
            success: true,
            message: "Content generated successfully.",
            data: {
                content,
            },
        });
    } catch (error) {
        console.error("Content generation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate content.",
        });
    }
};