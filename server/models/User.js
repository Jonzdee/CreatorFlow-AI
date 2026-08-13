import mongoose from "mongoose";
import validator from "validator";
import {
    PLATFORMS,
    GOALS,
    WRITING_STYLES,
    EXPERIENCE_LEVELS,
    POSTING_FREQUENCIES,
    NICHES,
} from "../../shared/index.js";


const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email address",
            },
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },

        // ==========================
        // Creator Profile
        // ==========================

        niche: {
            type: String,
            enum: [...NICHES, ""],
            default: "",
        },

        platforms: {
            type: [String],
            enum: PLATFORMS,
            default: [],
        },

        primaryPlatform: {
            type: String,
            enum: [...PLATFORMS, null],
            default: null,
        },

        goals: {
            type: [
                {
                    type: String,
                    enum: GOALS,
                },
            ],
            default: [],
        },

        writingStyle: {
            type: String,
            enum: WRITING_STYLES,
            default: "Friendly",
        },

        experienceLevel: {
            type: String,
            enum: EXPERIENCE_LEVELS,
            default: "Beginner",
        },

        country: {
            type: String,
            default: "",
            trim: true,
        },

        timezone: {
            type: String,
            default: "",
        },

        postingFrequency: {
            type: String,
            enum: [...POSTING_FREQUENCIES, null],
            default: null,
        },

        preferredPostingTime: {
            type: String,
            default: "",
        },

        weeklyContentTime: {
            type: Number,
            default: 0,
            min: [0, "Content time cannot be negative"],
            max: [168, "There are only 168 hours in a week"],
        },

        brandVoice: {
            type: String,
            default: "",
            trim: true,
        },

        onboardingCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;