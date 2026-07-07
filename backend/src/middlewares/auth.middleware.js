import User from "../models/user.model.js";
import * as TokenService from "../services/token.service.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Access token is required");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Invalid authorization header");
        }

        const decoded = TokenService.verifyAccessToken(token);
        const user = await User.findById(decoded.id).select("-password");;
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
}