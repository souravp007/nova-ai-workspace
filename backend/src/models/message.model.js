import mongoose from "mongoose";


const attachmentSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["image", "file"],
            required: true,
        },

        originalName: {
            type: String,
        },

        size: {
            type: Number,
        },
    },
    {
        _id: false,
    }
);

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
            trim: true,
            default: "",
            maxlength: 50000
        },

        attachment: {
            type: [attachmentSchema],
            default: [],
        },

        model: {
            type: String,
            default: "llama-3.3-70b-versatile",
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
