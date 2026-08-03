import { PLATFORMS, GOALS } from "../constants/index.js";

export const validateOnboarding = (req, res, next) => {
    const {
        niche,
        platforms,
        primaryPlatform,
        goals,
        country,
        timezone,
        weeklyContentTime,
    } = req.body;

    const errors = [];

    // Required fields
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

    // Business Rules

    if (
        primaryPlatform &&
        Array.isArray(platforms) &&
        !platforms.includes(primaryPlatform)
    ) {
        errors.push(
            "Primary platform must be one of the selected platforms."
        );
    }

    // Validate platform names
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

    // Weekly Content Time
    if (
        weeklyContentTime !== undefined &&
        (weeklyContentTime < 0 || weeklyContentTime > 168)
    ) {
        errors.push(
            "Weekly content time must be between 0 and 168 hours."
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors,
        });
    }

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

    next();
};