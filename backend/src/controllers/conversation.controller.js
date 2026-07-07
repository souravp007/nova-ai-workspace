import asyncHandler from "../utils/asyncHandler.js";
import * as conversationService from "../services/conversation.service.js";


// export const createConversation = asyncHandler(async (req, res) => {

//     const conversation = await conversationService.createConversation(req.user._id);

//     return res.status(201).json({
//         success: true,
//         message: "Conversation created successfully",
//         data: conversation,
//     });

// });

export const getAllConversations = asyncHandler(async (req, res) => {

    const conversations = await conversationService.getAllConversations(req.user._id, req.validated.query);

    return res.status(200).json({
        success: true,
        data: conversations,
    });

});

export const getConversationById = asyncHandler(async (req, res) => {

    const conversation = await conversationService.getConversationById(
        req.validated.params.id,
        req.user._id
    );

    return res.status(200).json({
        success: true,
        data: conversation,
    });

});

export const renameConversation = asyncHandler(async (req, res) => {

    const conversation = await conversationService.renameConversation(
        req.validated.params.id,
        req.user._id,
        req.validated.body.title
    );

    return res.status(200).json({
        success: true,
        message: "Conversation renamed successfully",
        data: conversation,
    });

});

export const togglePinConversation = asyncHandler(async (req, res) => {

    const conversation = await conversationService.togglePinConversation(
        req.validated.params.id,
        req.user._id
    );

    return res.status(200).json({
        success: true,
        message: "Conversation updated successfully",
        data: conversation,
    });

});

export const deleteConversation = asyncHandler(async (req, res) => {

    await conversationService.deleteConversation(
        req.validated.params.id,
        req.user._id
    );

    return res.status(204).json({
        success: true,
        message: "Conversation deleted successfully",
    });

});
