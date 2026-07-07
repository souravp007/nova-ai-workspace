import asyncHandler from "../utils/asyncHandler.js";
import * as aiService from "../services/ai.service.js";

export const sendMessage = asyncHandler(async (req, res) => {

    const { conversationId, message } = req.validated.body;

    const result =
        await aiService.sendMessage(
            conversationId,
            req.user._id,
            message
        );

    return res.status(200).json({
        success: true,
        message: "Response generated successfully",
        data: result,
    });

});

export const streamMessage = asyncHandler(async (req, res, next) => {
    const { conversationId, message } = req.validated.body;

    res.setHeader("Content-Type", "text/event-stream");

    res.setHeader("Cache-Control", "no-cache");

    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    const { conversation, stream } = await aiService.streamMessage({
        conversationId,
        userId: req.user._id,
        message,
    });

    let finalResponse = "";

    let totalTokens = 0;

    for await (const chunk of stream) {

        const text = chunk.text || "";

        finalResponse += text;

        // Optional: get usage if available in final chunk
        if (chunk.usageMetadata) {
            totalTokens =
                chunk.usageMetadata.totalTokenCount || 0;
        }

        res.write(
            `data: ${JSON.stringify({
                text,
            })}\n\n`
        );

    }

    await aiService.saveStreamResponse({

        conversationId: conversation._id,

        response: finalResponse,

        tokensUsed: totalTokens,

    });

    res.write(`event: end\n`);

    res.write(`data: done\n\n`);

    res.end();
})

