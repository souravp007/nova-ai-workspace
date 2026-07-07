import mongoose from "mongoose";
import { z } from "zod";

const objectId = z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: "Invalid ObjectId" }
);

export const chatSchema = z.object({
    body: z.object({

        conversationId: objectId.optional(),

        message: z
            .string()
            .trim()
            .min(1, "Message is required")
            .max(5000),

    }),
});