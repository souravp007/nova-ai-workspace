import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";
import { COOKIE_NAMES, REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants/cookie.constants.js";

const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.validated.body);
    return res.cookie(
        COOKIE_NAMES.REFRESH_TOKEN,
        result.refreshToken,
        {
            ...REFRESH_TOKEN_COOKIE_OPTIONS,
            maxAge: REFRESH_COOKIE_MAX_AGE,
        }
    ).status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            user: result.user,
            accessToken: result.accessToken
        },
    });
})

export const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.validated.body);
    return res.cookie(COOKIE_NAMES, result.refreshToken, {
        ...REFRESH_TOKEN_COOKIE_OPTIONS,
        maxAge: REFRESH_COOKIE_MAX_AGE,
    }).status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

export const getCurrentUser = asyncHandler(async (req, res) => {

    const user = await authService.getCurrentUser(req.user);

    return res.status(200).json({
        success: true,
        data: user
    });

});

export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[COOKIE_NAMES];

    await authService.logout(refreshToken);

    res.clearCookie(
        COOKIE_NAMES,
        REFRESH_TOKEN_COOKIE_OPTIONS
    );

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });

});

export const refreshAccessToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies?.[COOKIE_NAMES];

    const tokens = await authService.refreshAccessToken(refreshToken);

    return res.cookie(
        COOKIE_NAMES,
        tokens.refreshToken,
        {
            ...REFRESH_TOKEN_COOKIE_OPTIONS,
            maxAge: REFRESH_COOKIE_MAX_AGE,
        }
    ).status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        data: {
            accessToken: tokens.accessToken,
        },
    });


})


