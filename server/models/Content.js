import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        contentType: {
            type: String,
            required: true,
        },

        platform: {
            type: String,
            required: true,
        },

        topic: {
            type: String,
            required: true,
            trim: true,
        },

        writingStyle: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["draft", "scheduled", "published"],
            default: "draft",
        },

        scheduledAt: {
            type: Date,
            default: null,
        },

        publishedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;