import express from "express";
import { completeOnboarding, getCurrentUser} from "../controller/userController.js";
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
export default router;