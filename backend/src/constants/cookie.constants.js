const isProduction = process.env.NODE_ENV === "production";

export const REFRESH_TOKEN_COOKIE_OPTIONS = Object.freeze({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
});

export const COOKIE_NAMES = "rt";