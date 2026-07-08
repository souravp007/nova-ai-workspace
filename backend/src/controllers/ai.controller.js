import asyncHandler from "../utils/asyncHandler.js";
import * as aiService from "../services/ai.service.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const files = req.files || [];
    const { conversationId, message } = req.validated.body;

    const result = await aiService.sendMessage({
        conversationId,
        userId: req.user._id,
        message,
        files,
    });

    return res.status(200).json({
        success: true,
        message: "Response generated successfully",
        data: result,
    });

});

export const streamMessage = asyncHandler(async (req, res, next) => {
    const files = req.files || [];
    const { conversationId, message } = req.validated.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.flushHeaders();

    try {
        const { conversationId: chatId, stream } = await aiService.streamMessage({
            conversationId,
            userId: req.user._id,
            message,
            files
        });

        res.write(
            `data: ${JSON.stringify({
                type: "start",
                conversationId: chatId,
            })}\n\n`
        );

        let finalResponse = "";

        let totalTokens = 0;

        for await (const chunk of stream) {

            const text = chunk.text || "";

            finalResponse += text;

            // Optional: get usage if available in final chunk
            if (chunk.usageMetadata) {
                totalTokens = chunk.usageMetadata.totalTokenCount || 0;
            }

            res.write(
                `data: ${JSON.stringify({
                    type: "chunk",
                    text,
                })}\n\n`
            );

        }

        await aiService.saveStreamResponse({
            conversationId: chatId,
            userMessage: message,
            response: finalResponse,
            tokensUsed: totalTokens,
        });

        res.write(`event: end\n`);

        res.write(
            `data: ${JSON.stringify({
                type: "end",
                conversationId: chatId,
            })}\n\n`
        );
    } catch (error) {
        res.write(`event: error\n`);
        res.write(
            `data: ${JSON.stringify({
                message: error.message || "Stream failed",
            })}\n\n`
        );
    } finally {
        await aiService.cleanupFiles(files);
    }

    res.end();
});

