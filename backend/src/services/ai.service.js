import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import * as geminiService from "./gemini.service.js";

export const sendMessage = async ({
    conversationId,
    userId,
    message,
}) => {

    const {
        conversation,
        history,
    } = await prepareConversation({
        conversationId,
        userId,
        message,
    });

    const aiResult =
        await geminiService.generateResponse(
            history
        );

    await Message.create({

        conversationId: conversation._id,

        role: "assistant",

        content: aiResult.text,

        tokensUsed:
            aiResult.usage?.totalTokenCount || 0,

    });

    conversation.lastMessage =
        aiResult.text.substring(0, 100);

    conversation.lastMessageAt =
        new Date();

    await conversation.save();

    return {

        conversationId:
            conversation._id,

        response:
            aiResult.text,

        tokensUsed:
            aiResult.usage?.totalTokenCount || 0,

    };

};




export const streamMessage = async ({
    conversationId,
    userId,
    message,
}) => {

    const {
        conversation,
        history,
    } = await prepareConversation({
        conversationId,
        userId,
        message,
    });

    const stream = await geminiService.generateStreamResponse(
        history
    );

    return {
        conversation,
        stream,
    };

};


export const saveStreamResponse = async ({
    conversation,
    response,
    tokensUsed = 0,
}) => {

    await Message.create({

        conversationId:
            conversation._id,

        role: "assistant",

        content: response,

        tokensUsed,

    });

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

    // Save User Message

    await Message.create({
        conversationId: activeConversationId,
        role: "user",
        content: message,
    });

    // Last 20 Messages

    const messages = await Message.find({
        conversationId: activeConversationId,
    })
        .sort({
            createdAt: -1,
        })
        .limit(20);

    messages.reverse();

    const history = messages.map((item) => ({
        role:
            item.role === "assistant"
                ? "model"
                : "user",

        parts: [
            {
                text: item.content,
            },
        ],
    }));

    return {
        conversation,
        history,
    };

};