import mongoose from "mongoose";

const contentMediaSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },

        publicId: {
            type: String,
            required: true,
            trim: true,
        },

        resourceType: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },

        originalName: {
            type: String,
            default: "",
            trim: true,
        },

        format: {
            type: String,
            default: "",
            trim: true,
        },

        width: {
            type: Number,
            default: null,
            min: 0,
        },

        height: {
            type: Number,
            default: null,
            min: 0,
        },

        duration: {
            type: Number,
            default: null,
            min: 0,
        },

        bytes: {
            type: Number,
            default: null,
            min: 0,
        },
    },
    {
        _id: false,
    }
);

const contentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        contentType: {
            type: String,
            required: true,
            trim: true,
        },

        platform: {
            type: String,
            required: true,
            trim: true,
        },

        topic: {
            type: String,
            required: true,
            trim: true,
        },

        writingStyle: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        media: {
            type: [contentMediaSchema],
            default: [],
        },

        status: {
            type: String,
            enum: ["draft", "scheduled", "published"],
            default: "draft",
            index: true,
        },

        scheduledAt: {
            type: Date,
            default: null,
            index: true,
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