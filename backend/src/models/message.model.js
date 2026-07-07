import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50000
        },
        model: {
            type: String,
            default: "gemini-2.5-flash",
        },

        tokensUsed: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true
    }
);

messageSchema.index({
    conversationId: 1,
    createdAt: 1,
});


const Message = mongoose.model("Message", messageSchema);

export default Message;