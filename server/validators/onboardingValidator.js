import {
    PLATFORMS,
    GOALS,
    WRITING_STYLES,
    POSTING_FREQUENCIES,
} from "../../shared/index.js";

export const validateOnboarding = (req, res, next) => {
    const {
        niche,
        platforms,
        primaryPlatform,
        goals,
        writingStyle,
        country,
        timezone,
        postingFrequency,
        preferredPostingTime,
        weeklyContentTime,
        brandVoice,
    } = req.body;

    const errors = [];

    // =========================
    // Required fields
    // =========================

    if (!niche?.trim()) {
        errors.push("Niche is required.");
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
        errors.push("Select at least one platform.");
    }

    if (!primaryPlatform) {
        errors.push("Primary platform is required.");
    }

    if (!Array.isArray(goals) || goals.length === 0) {
        errors.push("Select at least one goal.");
    }

    if (!country?.trim()) {
        errors.push("Country is required.");
    }

    if (!timezone?.trim()) {
        errors.push("Timezone is required.");
    }

    // =========================
    // Platforms
    // =========================

    if (Array.isArray(platforms)) {
        const invalidPlatforms = platforms.filter(
            (platform) => !PLATFORMS.includes(platform)
        );

        if (invalidPlatforms.length > 0) {
            errors.push(
                `Invalid platform(s): ${invalidPlatforms.join(", ")}`
            );
        }
    }

    // =========================
    // Primary Platform
    // =========================

    if (primaryPlatform) {
        if (!PLATFORMS.includes(primaryPlatform)) {
            errors.push(`Invalid primary platform: ${primaryPlatform}`);
        }

        if (
            Array.isArray(platforms) &&
            !platforms.includes(primaryPlatform)
        ) {
            errors.push(
                "Primary platform must be one of the selected platforms."
            );
        }
    }

    // =========================
    // Goals
    // =========================

    if (Array.isArray(goals)) {
        const invalidGoals = goals.filter(
            (goal) => !GOALS.includes(goal)
        );

        if (invalidGoals.length > 0) {
            errors.push(
                `Invalid goal(s): ${invalidGoals.join(", ")}`
            );
        }
    }

    // =========================
    // Writing Style
    // =========================

    if (
        writingStyle &&
        !WRITING_STYLES.includes(writingStyle)
    ) {
        errors.push(`Invalid writing style: ${writingStyle}`);
    }

    // =========================
    // Posting Frequency
    // =========================

    if (
        postingFrequency &&
        !POSTING_FREQUENCIES.includes(postingFrequency)
    ) {
        errors.push(
            `Invalid posting frequency: ${postingFrequency}`
        );
    }

    // =========================
    // Weekly Content Time
    // =========================

    if (
        weeklyContentTime !== undefined &&
        (Number(weeklyContentTime) < 0 ||
            Number(weeklyContentTime) > 168)
    ) {
        errors.push(
            "Weekly content time must be between 0 and 168 hours."
        );
    }

    // =========================
    // Brand Voice
    // =========================

    if (!brandVoice?.trim()) {
        errors.push("Brand voice is required.");
    }

    // =========================
    // Return errors
    // =========================

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

    next();
};