import mongoose from "mongoose";
import z from "zod";

const objectId = z.string().refine(
    (id) => mongoose.Types.ObjectId.isValid(id),
    { message: "Invalid ObjectId" }
);

export const getConversationIdSchema = z.object({
    params: z.object({
        id: objectId
    })
})

export const renameConversationSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(100, "Title cannot exceed 100 characters"),
    })

});

export const getAllConversationSchema = z.object({
    query: z.object({

        page: z.coerce
            .number()
            .int()
            .positive()
            .default(1),

        limit: z.coerce
            .number()
            .int()
            .positive()
            .max(100)
            .default(20),

        search: z
            .string()
            .trim()
            .optional(),

    }),
});