// import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export const generateAIContent = async ({
//     contentType,
//     platform,
//     topic,
//     writingStyle,
// }) => {
//     const response = await openai.responses.create({
//         model: "gpt-5-mini",
//         instructions: `
// You are CreatorFlow AI, an expert social media content strategist.

// Create high-quality content that is natural, engaging, useful, and appropriate
// for the selected platform.

// Follow the requested content type, platform, topic, and writing style.

// Do not mention that you are an AI unless specifically asked.
// Do not add unnecessary explanations before or after the generated content.
//         `,
//         input: `
// Content Type: ${contentType}
// Platform: ${platform}
// Topic: ${topic}
// Writing Style: ${writingStyle}

// Generate the content now.
//         `,
//     });

//     return response.output_text;
// };

export const generateAIContent = async ({
    contentType,
    platform,
    topic,
    writingStyle,
}) => {
    return `🚀 CreatorFlow AI Test Content

Topic: ${topic}
Platform: ${platform}
Content Type: ${contentType}
Writing Style: ${writingStyle}

This is a temporary test response. OpenAI will generate the real content once the API is funded.

#CreatorFlowAI #ContentCreation`;
};