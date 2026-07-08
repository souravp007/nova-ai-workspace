import "dotenv/config";
import fs from "fs/promises";
import { SYSTEM_PROMPT } from "../constants/ai.constant.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_VISION_MODEL =
    process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";

const getApiKey = () => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is missing");
    }

    return process.env.GROQ_API_KEY;
};

const readGroqError = async (response) => {
    try {
        const payload = await response.json();
        return payload?.error?.message || payload?.message || response.statusText;
    } catch {
        return response.statusText;
    }
};

const createImagePart = async (file) => {
    const imageBuffer = await fs.readFile(file.path);

    return {
        type: "image_url",
        image_url: {
            url: `data:${file.mimetype};base64,${imageBuffer.toString("base64")}`,
        },
    };
};

const buildMessages = async ({ history, files = [] }) => {
    const messages = [
        {
            role: "system",
            content: SYSTEM_PROMPT,
        },
        ...history.map((item) => ({
            role: item.role,
            content: item.content || "",
        })),
    ];

    if (files.length === 0) {
        return messages;
    }

    const lastUserMessageIndex = messages.findLastIndex((item) => item.role === "user");
    if (lastUserMessageIndex === -1) {
        return messages;
    }

    const text = messages[lastUserMessageIndex].content || "Please analyze the attached image.";
    const imageParts = await Promise.all(files.map(createImagePart));

    messages[lastUserMessageIndex] = {
        role: "user",
        content: [
            {
                type: "text",
                text,
            },
            ...imageParts,
        ],
    };

    return messages;
};

const createChatCompletion = async ({ history, files = [], stream = false }) => {
    const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getApiKey()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: files.length > 0 ? GROQ_VISION_MODEL : GROQ_MODEL,
            messages: await buildMessages({ history, files }),
            temperature: 0.7,
            max_completion_tokens: 2048,
            top_p: 1,
            stream,
        }),
    });

    if (!response.ok) {
        throw new Error(`Groq Error: ${await readGroqError(response)}`);
    }

    return response;
};

export const generateResponse = async ({ history, files = [] }) => {
    const response = await createChatCompletion({
        history,
        files,
        stream: false,
    });
    const data = await response.json();

    return {
        text: data.choices?.[0]?.message?.content || "",
        usage: data.usage?.total_tokens || 0,
        model: data.model,
    };
};

export const generateStreamResponse = async ({ history, files = [] }) => {
    const response = await createChatCompletion({
        history,
        files,
        stream: true,
    });

    return parseGroqStream(response.body);
};

export const generateConversationTitle = async (message) => {
    const response = await createChatCompletion({
        history: [
            {
                role: "user",
                content: `Generate a short conversation title, maximum 5 words, for: "${message}". Return only the title.`,
            },
        ],
        stream: false,
    });
    const data = await response.json();

    return (data.choices?.[0]?.message?.content || "New Chat")
        .replace(/^["']|["']$/g, "")
        .trim();
};

async function* parseGroqStream(body) {
    const decoder = new TextDecoder();
    let buffer = "";

    for await (const value of body) {
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const rawEvent of events) {
            const dataLines = rawEvent
                .split("\n")
                .filter((line) => line.startsWith("data:"))
                .map((line) => line.slice(5).trimStart());

            for (const dataLine of dataLines) {
                if (!dataLine || dataLine === "[DONE]") {
                    continue;
                }

                const payload = JSON.parse(dataLine);
                const text = payload.choices?.[0]?.delta?.content || "";

                if (text) {
                    yield { text };
                }
            }
        }
    }
}
