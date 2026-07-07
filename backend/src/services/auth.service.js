import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import ApiError from "../utils/ApiError.js";
import * as TokenService from "./token.service.js";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

const buildTokenPayload = (user) => ({
    id: user._id,
    email: user.email,
    role: user.role,
});

const calculateExpiryDate = () => {
    return new Date(
        Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
};

const storeRefreshToken = async (userId, refreshToken) => {
    await RefreshToken.create({
        userId,
        tokenHash: TokenService.hashToken(refreshToken),
        expiresAt: calculateExpiryDate(),
    });
};




export const register = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "Email already registered");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = TokenService.generateAccessToken(payload);

    const refreshToken = TokenService.generateRefreshToken(payload);

    await storeRefreshToken(user._id, refreshToken);

    const createdUser = await User.findById(user._id);

    return {
        user: createdUser,
        accessToken,
        refreshToken,
    };
};

export const login = async (userData) => {
    const { email, password } = userData;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    await RefreshToken.deleteMany({
        userId: user._id,
    });

    const payload = buildTokenPayload(user);

    const accessToken = TokenService.generateAccessToken(payload);

    const refreshToken = TokenService.generateRefreshToken(payload);

    await storeRefreshToken(user._id, refreshToken);

    user.lastLogin = new Date();
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
        user: userResponse,
        accessToken,
        refreshToken,
    };
};

export const getCurrentUser = async (user) => {
    return user;
};

export const logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const tokenHash = TokenService.hashToken(refreshToken);

    await RefreshToken.findOneAndDelete({
        tokenHash,
    });

    return true;
};

export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    const decoded = TokenService.verifyRefreshToken(refreshToken);

    const tokenHash = TokenService.hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({ tokenHash });

    if (!storedToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const payload = buildTokenPayload(user);

    const accessToken = TokenService.generateAccessToken(payload);

    const refToken = TokenService.generateRefreshToken(payload);

    await RefreshToken.deleteOne({
        _id: storedToken._id,
    });

    await storeRefreshToken(
        user._id,
        refToken
    );

    return {
        accessToken: accessToken,
        refreshToken: refToken,
    };
}

