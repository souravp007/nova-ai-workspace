import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import ApiError from "../utils/ApiError.js";


export const getMessages = async (
    conversationId,
    userId
) => {

    const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const messages = await Message.find({
        conversationId,
    }).select("role content tokensUsed createdAt").sort({
        createdAt: 1,
    });

    return messages;
};