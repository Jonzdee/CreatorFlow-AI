import { getAssistantResponse } from "../services/assistantService.js";

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