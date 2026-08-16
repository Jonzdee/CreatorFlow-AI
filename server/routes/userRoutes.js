import express from "express";
import { 
    completeOnboarding,
     getCurrentUser, 
     updateProfile,
    changePassword
     } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateOnboarding } from "../validators/onboardingValidator.js";

const router = express.Router();

router.put(
    "/onboarding",
    authMiddleware,
    validateOnboarding,
    completeOnboarding
);
router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);
export default router;