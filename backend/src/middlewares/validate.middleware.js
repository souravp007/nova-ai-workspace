import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
    });

    console.log("Validation result :", result);


    if (!result.success) {
        return next(
            new ApiError(400, "Validation failed", result.error.flatten().fieldErrors)
        )
    }

    req.validated = result.data;
    next();
};