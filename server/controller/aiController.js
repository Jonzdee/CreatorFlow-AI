import { generateWithGemini } from "../services/geminiService.js";

export const generateContent = async (req, res) => {
    try {
        const {
            platform,
            contentType,
            topic,
            tone,
            includeHook,
            includeCTA,
            includeHashtags,
        } = req.body;

        if (!platform || !contentType || !topic) {
            return res.status(400).json({
                success: false,
                message: "Platform, content type and topic are required.",
            });
        }

        const prompt = `
You are CreatorFlow AI, an expert social media content strategist
and social media manager.

Create high-quality social media content for a content creator.

Creator information:
- Platform: ${platform}
- Content type: ${contentType}
- Topic: ${topic}
- Tone: ${tone || "Friendly"}

Requirements:
${includeHook ? "- Include a strong attention-grabbing hook." : ""}
${includeCTA ? "- Include a clear call-to-action." : ""}
${includeHashtags ? "- Include relevant hashtags." : ""}

Important instructions:
- Make the content natural and human-sounding.
- Do not sound robotic or generic.
- Adapt the writing style to the selected platform.
- Make the content practical and engaging.
- Do not explain your reasoning.
- Return only the final content.

Structure the response clearly.
`;

        const result = await generateWithGemini(prompt);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("AI generation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate content.",
        });
    }
};