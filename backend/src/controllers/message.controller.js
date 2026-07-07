import asyncHandler from "../utils/asyncHandler.js";
import * as messageService from "../services/message.service.js";

export const getMessages = asyncHandler(async (req, res) => {

    const messages = await messageService.getMessages(
        req.validated.params.id,
        req.user._id
    );

    return res.status(200).json({
        success: true,
        data: messages,
    });

});