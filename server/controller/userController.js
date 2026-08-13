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


// Get currently logged-in user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });

    } catch (error) {
        console.error("Get current user error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch user",
        });
    }
};