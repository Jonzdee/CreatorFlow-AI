import express from "express";
import { completeOnboarding } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateOnboarding } from "../validators/onboardingValidator.js";

const router = express.Router();

router.put(
    "/onboarding",
    authMiddleware,
    validateOnboarding,
    completeOnboarding
);

export default router;