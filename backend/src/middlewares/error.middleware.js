import mongoose from "mongoose";
import JsonWebTokenError from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors || [],
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];

        return res.status(409).json({
            success: false,
            statusCode: 409,
            message: `${field} already exists.`,
            errors: [],
        });
    }

    // Invalid ObjectId
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Invalid resource id.",
            errors: [],
        });
    }

    // Mongoose Validation Error
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Validation failed.",
            errors: Object.values(err.errors).map((error) => ({
                field: error.path,
                message: error.message,
            })),
        });
    }

    // JWT Expired
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Session expired. Please login again.",
            errors: [],
        });
    }


    // Invalid JWT
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Invalid authentication token.",
            errors: [],
        });
    }

    // Unknown Error
    console.error(err);

    return res.status(500).json({
        success: false,
        statusCode: 500,
        message:
            process.env.NODE_ENV === "production"
                ? "Something went wrong."
                : err.message,
        errors: [],
    });
}

export default errorHandler;