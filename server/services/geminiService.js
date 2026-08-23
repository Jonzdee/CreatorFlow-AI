import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

export const generateWithGemini = async ({
    contentType,
    platform,
    topic,
    writingStyle,
}) => {
    try {
        const prompt = `
You are CreatorFlow AI, an expert social media content manager.

Generate high-quality content for a creator.

CONTENT TYPE:
${contentType}

PLATFORM:
${platform}

TOPIC:
${topic}

WRITING STYLE:
${writingStyle}

Return ONLY valid JSON.
Do not use markdown fences.
Do not add explanations before or after the JSON.

Use exactly this structure:

{
  "title": "short title",
  "hook": "strong opening hook",
  "content": "complete publish-ready content",
  "caption": "platform-appropriate caption",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "callToAction": "clear CTA",
  "contentType": "${contentType}",
  "platform": "${platform}",
  "writingStyle": "${writingStyle}"
}

Rules:
- Make the content specifically appropriate for the selected platform.
- Respect the selected content type.
- Follow the requested writing style.
- Do not invent statistics or facts.
- Make the hook attention-grabbing but not misleading.
- Make the content useful and publish-ready.
- Hashtags must be relevant.
`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = response.text;

        if (!text) {
            throw new Error("Gemini returned an empty response.");
        }

        let parsed;

        try {
            parsed = JSON.parse(text);
        } catch (parseError) {
            console.error("Gemini JSON parse error:", parseError);
            console.error("Gemini raw response:", text);

            throw new Error("Gemini returned invalid JSON.");
        }

        if (
            !parsed.content ||
            typeof parsed.content !== "string"
        ) {
            throw new Error("Gemini response does not contain valid content.");
        }

        return {
            title: parsed.title || "",
            hook: parsed.hook || "",
            content: parsed.content,
            caption: parsed.caption || "",
            hashtags: Array.isArray(parsed.hashtags)
                ? parsed.hashtags
                : [],
            callToAction: parsed.callToAction || "",
            contentType: parsed.contentType || contentType,
            platform: parsed.platform || platform,
            writingStyle: parsed.writingStyle || writingStyle,
        };
    } catch (error) {
        console.error("Gemini API error:", error);

        throw new Error(
            error.message || "Failed to generate AI content."
        );
    }
};
export const generateAssistantResponse = async ({
    message,
    userContext,
}) => {
    try {
        const prompt = `
You are CreatorFlow AI, an intelligent social media manager.

You are assisting a content creator inside CreatorFlow.

Your job is to:
- Understand the creator's question.
- Analyze their available CreatorFlow data.
- Give practical recommendations.
- Suggest content ideas when appropriate.
- Help with content strategy.
- Consider their previous content.
- Consider their saved ideas.
- Consider their analytics.
- Never pretend to know information that is not provided.

CREATOR MESSAGE:
${message}

CREATOR CONTEXT:
${JSON.stringify(userContext, null, 2)}

Return ONLY valid JSON.
Do not use markdown fences.
Do not add explanations before or after the JSON.

Use exactly this structure:

{
    "type": "recommendation",
    "message": "helpful response to the creator",
    "recommendation": {
        "title": "",
        "topic": "",
        "platform": "",
        "contentType": "",
        "writingStyle": "",
        "reason": ""
    },
    "actions": [
        {
            "label": "",
            "action": ""
        }
    ]
}

Rules:

- Be useful and specific.
- Use the creator's actual context whenever possible.
- Do not invent analytics.
- Do not invent previous posts.
- Do not invent saved ideas.
- If there is not enough information, clearly say so.
- Keep recommendations realistic.
- If recommending content, make the topic specific.
- Platform must come from the creator's available platforms when possible.
- Content type must come from the creator's available content types when possible.
- Actions should only describe actions CreatorFlow can reasonably perform.
`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = response.text;

        if (!text) {
            throw new Error("Gemini returned an empty assistant response.");
        }

        let parsed;

        try {
            parsed = JSON.parse(text);
        } catch (parseError) {
            console.error("Assistant JSON parse error:", parseError);
            console.error("Assistant raw response:", text);

            throw new Error("Gemini returned invalid assistant JSON.");
        }

        return {
            type: parsed.type || "general",
            message: parsed.message || "",
            recommendation: {
                title: parsed.recommendation?.title || "",
                topic: parsed.recommendation?.topic || "",
                platform: parsed.recommendation?.platform || "",
                contentType: parsed.recommendation?.contentType || "",
                writingStyle: parsed.recommendation?.writingStyle || "",
                reason: parsed.recommendation?.reason || "",
            },
            actions: Array.isArray(parsed.actions)
                ? parsed.actions
                : [],
        };
    } catch (error) {
        console.error("Gemini assistant error:", error);

        throw new Error(
            error.message || "Failed to generate assistant response."
        );
    }
};
export const generateDashboardGreeting = async ({
    name,
    analytics,
    recentContent,
}) => {
    try {
        const prompt = `
You are CreatorFlow AI, a friendly and intelligent social media manager.

Generate a short personalized greeting for a content creator opening their CreatorFlow dashboard.

CREATOR NAME:
${name || "Creator"}

CREATOR ANALYTICS:
${JSON.stringify(analytics, null, 2)}

RECENT CONTENT:
${JSON.stringify(recentContent, null, 2)}

Rules:
- Greet the creator naturally.
- Mention their name.
- Use their actual CreatorFlow data when useful.
- Never invent statistics or content.
- If they have drafts, encourage them to work on them.
- If they have scheduled content, acknowledge their consistency.
- If they have no content, encourage them to create their first piece.
- Sound like a helpful human social media manager.
- Keep it short.
- Do not use markdown.

Return ONLY valid JSON.

Use exactly:

{
    "greeting": ""
}
`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        const text = response.text;

        if (!text) {
            throw new Error(
                "Gemini returned an empty dashboard greeting."
            );
        }

        let parsed;

        try {
            parsed = JSON.parse(text);
        } catch (error) {
            console.error(
                "Dashboard greeting JSON parse error:",
                error
            );

            console.error(
                "Gemini raw response:",
                text
            );

            throw new Error(
                "Gemini returned invalid dashboard greeting JSON."
            );
        }

        return {
            greeting:
                parsed.greeting ||
                `Welcome back, ${name || "Creator"}! 👋`,
        };
    } catch (error) {
        console.error(
            "Gemini dashboard greeting error:",
            error
        );

        throw new Error(
            error.message ||
            "Failed to generate dashboard greeting."
        );
    }
};