import asyncHandler from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
    return res.status(200).json({ sucess: true, message: "Server is healthy" })
})