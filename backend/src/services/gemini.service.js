import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { SYSTEM_PROMPT } from "../constants/ai.constant.js";
import fs from "fs/promises";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateResponse = async ({
    history,
    files = [],
}) => {
    try {

        const contents = [...history];

        // Attach images to the latest user message
        if (files.length > 0) {

            const lastIndex = contents.length - 1;

            for (const file of files) {

                const imageBuffer = await fs.readFile(file.path);

                contents[lastIndex].parts.push({
                    inlineData: {
                        data: imageBuffer.toString("base64"),
                        mimeType: file.mimetype,
                    },
                });

            }

        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
        });

        return {
            text: response.text,
            usage:
                response.usageMetadata?.totalTokenCount || 0,
        };

    } catch (error) {

        console.error("Gemini Error:", error);

        throw error;

    }
};


export const generateStreamResponse = async ({
    history,
    files = [],
}) => {

    const contents = [...history];

    if (files.length > 0) {

        const lastIndex = contents.length - 1;

        for (const file of files) {

            const imageBuffer = await fs.readFile(file.path);

            contents[lastIndex].parts.push({
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType: file.mimetype,
                },
            });

        }

    }

    const stream =
        await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents,
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
                        text: `Generate a short conversation title (maximum 5 words) for: "${message}". Return only the title.`,
                    },
                ],
            },
        ],
    });

    return response.text.trim();

};