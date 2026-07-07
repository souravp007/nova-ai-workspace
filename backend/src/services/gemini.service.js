import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { SYSTEM_PROMPT } from "../constants/ai.constant.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateResponse = async (history) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: history,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
        });

        const metadata = response.usageMetadata;

        console.log(`Prompt Tokens: ${metadata}`);

        return {
            text: response.text,
            usage: metadata.promptTokenCount,
        };

    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
    }

};


export const generateStreamResponse = async (history) => {

    const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: history,
        config: {
            systemInstruction: SYSTEM_PROMPT,
        },
    });

    return stream;
};


export const generateConversationTitle = async (message) => {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `Generate a short conversation title (maximum 5 words) for: "${message}".
Return only the title.`,
                    },
                ],
            },
        ],
    });

    return response.text.trim();
};