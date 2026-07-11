import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import * as groqService from "./groq.service.js";
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

        const aiResult = await groqService.generateResponse({
            history,
            files: attachments,
        });

        if (conversation.title === "New Chat") {

            conversation.title = await groqService.generateConversationTitle(
                message || "Image Conversation"
            );

        }

        await Message.create({

            conversationId:
                conversation._id,

            role: "assistant",

            content:
                aiResult.text,

            model:
                aiResult.model,

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
        await groqService.generateStreamResponse({
            history,
            files: attachments,
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
            await groqService.generateConversationTitle(
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
    const imageFiles = [];

    for (const file of files) {
        const isImage = file.mimetype.startsWith("image/");
        const uploaded = isImage
            ? await cloudinaryService.uploadImage(file.path)
            : await cloudinaryService.uploadFile(file.path);

        attachments.push({
            url: uploaded.url,
            publicId: uploaded.publicId,
            type: isImage ? "image" : "file",
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
        });

        if (isImage) {
            imageFiles.push(file);
        }
    }

    const fileSummary = attachments
        .filter((attachment) => attachment.type === "file")
        .map((attachment) => attachment.originalName)
        .join(", ");

    let userContent = message || "";
    if (fileSummary) {
        userContent += `${userContent ? "\n\n" : ""}Attached files: ${fileSummary}`;
    }

    await Message.create({
        conversationId: activeConversationId,
        role: "user",
        content: userContent,
        attachment: attachments,
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

        return {
            role: item.role,
            content: item.content || "",
        };

    });

    return {
        conversation,
        history,
        attachments: imageFiles,
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
