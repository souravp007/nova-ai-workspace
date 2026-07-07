import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import ApiError from "../utils/ApiError.js";

// export const createConversation = async (userId) => {
//     const conversation = await Conversation.create({
//         userId,
//     });

//     return conversation;
// }

export const getAllConversations = async (userId, { page = 1, limit = 10, search = "" }) => {

    const filter = {
        userId,
    };

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i",
        };

    }

    const skip = (page - 1) * limit;

    const conversations = await Conversation.find(filter)
        .select("title lastMessage lastMessageAt isPinned createdAt updatedAt")
        .sort({
            isPinned: -1,
            updatedAt: -1,
        }).skip(skip).limit(limit);

    const total = await Conversation.countDocuments(filter);

    return {

        conversations,

        pagination: {

            total,

            page,

            limit,

            totalPages:
                Math.ceil(total / limit),

        },
    }
};


export const getConversationById = async (
    conversationId,
    userId
) => {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        throw new ApiError(400, "Invalid conversation id");
    }

    const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    return conversation;
};


export const renameConversation = async (
    conversationId,
    userId,
    title
) => {
    const conversation = await Conversation.findOneAndUpdate(
        {
            _id: conversationId,
            userId,
        },
        {
            title,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    return conversation;
};


export const togglePinConversation = async (
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

    conversation.isPinned = !conversation.isPinned;

    await conversation.save();

    return conversation;
};


export const deleteConversation = async (
    conversationId,
    userId
) => {
    const conversation = await Conversation.findOneAndDelete({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    return;
};



