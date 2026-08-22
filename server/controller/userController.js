import bcrypt from "bcryptjs";
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

export const updateProfile = async (req, res) => {
    try {
        const { name, niche, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update only the fields that were provided
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name is required",
                });
            }

            user.name = name.trim();
        }

        if (niche !== undefined) {
            user.niche = niche;
        }

        if (avatar !== undefined) {
            user.avatar = avatar;
        }

        await user.save();

        // Don't return password
        const updatedUser = user.toObject();
        delete updatedUser.password;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};
export const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.password) {
            return res.status(500).json({
                success: false,
                message: "User password is not available",
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );
        
       
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to change password",
        });
    }
};