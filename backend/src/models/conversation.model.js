import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            default: "New Chat",
            trim: true,
            maxlength: 100,
        },
        lastMessage: {
            type: String,
            default: "",
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
);

conversationSchema.index({
    userId: 1,
    updatedAt: -1,
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;