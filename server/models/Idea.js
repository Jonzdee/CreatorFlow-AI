import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        platform: {
            type: String,
            trim: true,
            default: "",
        },

        contentType: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;