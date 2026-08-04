import User from "../models/User.js";

export const completeOnboarding = async (req, res) => {
    try {

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                ...req.body,
                onboardingCompleted: true,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            data: updatedUser,
        });

    } catch (error) {
        console.error("Validation Error:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
            errors: error.errors,
        });
    }
};