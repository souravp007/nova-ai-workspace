import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import * as geminiService from "./gemini.service.js";
import * as cloudinaryService from "./cloudinary.service.js"
import fs from "fs/promises";

export const sendMessage = async ({
    conversationId,
    userId,
    message,
    files = [],
}) => {

    try {

        const {

            conversation,

            history,

            attachments,

        } = await prepareConversation({

            conversationId,

            userId,

            message,

            files,

        });

        const aiResult = await geminiService.generateResponse({
            history,
            attachments,
        });

        if (conversation.title === "New Chat") {

            conversation.title = await geminiService.generateConversationTitle(
                message || "Image Conversation"
            );

        }

        await Message.create({

            conversationId:
                conversation._id,

            role: "assistant",

            content:
                aiResult.text,

            tokensUsed:
                aiResult.usage || 0,

        });

        conversation.lastMessage =
            aiResult.text.substring(0, 100);

        conversation.lastMessageAt =
            new Date();

        await conversation.save();

        return {
            conversationId: conversation._id,
            response: aiResult.text,
            tokensUsed: aiResult.usage || 0,
        };

    } catch (error) {
        console.log("Error :", error)
    } finally {
        await cleanupFiles(files);
    }



};


export const streamMessage = async ({
    conversationId,
    userId,
    message,
    files = [],
}) => {

    const {
        conversation,
        history,
        attachments,
    } = await prepareConversation({
        conversationId,
        userId,
        message,
        files,
    });

    const stream =
        await geminiService.generateStreamResponse({
            history,
            attachments,
        });

    return {
        conversationId: conversation._id,
        stream,
        message,
    };

};


export const saveStreamResponse = async ({
    conversationId,
    userMessage,
    response,
    tokensUsed = 0,
}) => {

    const conversation =
        await Conversation.findById(conversationId);

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }

    await Message.create({

        conversationId,

        role: "assistant",

        content: response,

        tokensUsed,

    });

    /**
     * Generate Title
     */

    if (conversation.title === "New Chat") {

        conversation.title =
            await geminiService.generateConversationTitle(
                userMessage || "New Chat"
            );

    }

    conversation.lastMessage =
        response.substring(0, 100);

    conversation.lastMessageAt =
        new Date();

    await conversation.save();

};


const prepareConversation = async ({
    conversationId,
    userId,
    message,
    files = [],
}) => {

    let conversation;

    if (conversationId) {

        conversation = await Conversation.findOne({
            _id: conversationId,
            userId,
        });

        if (!conversation) {
            throw new ApiError(
                404,
                "Conversation not found"
            );
        }

    } else {

        conversation = await Conversation.create({
            userId,
        });

    }

    const activeConversationId = conversation._id;

    /**
     * Upload Images
     */

    const attachments = [];

    for (const file of files) {

        const uploaded =
            await cloudinaryService.uploadImage(file.path);

        attachments.push({

            url: uploaded.url,

            publicId: uploaded.publicId,

            type: "image",

            originalName: file.originalname,

            size: file.size,

        });

    }

    /**
     * Save User Message
     */

    await Message.create({

        conversationId: activeConversationId,

        role: "user",

        content: message || "",

        attachments,

    });

    /**
     * Conversation History
     */

    const messages = await Message.find({

        conversationId: activeConversationId,

    })
        .sort({
            createdAt: -1,
        })
        .limit(20);

    messages.reverse();

    const history = messages.map((item) => {

        const parts = [];

        if (item.content) {

            parts.push({
                text: item.content,
            });

        }

        return {

            role:
                item.role === "assistant"
                    ? "model"
                    : "user",

            parts,

        };

    });

    return {

        conversation,

        history,

        attachments: files,

    };

};

export const cleanupFiles = async (files = []) => {
    for (const file of files) {

        try {
            await fs.unlink(file.path);
        } catch (error) {
            console.error(
                `Failed to delete temporary file: ${file.path}`,
                error
            );
        }

    }
};
