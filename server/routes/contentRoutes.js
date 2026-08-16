import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateContent } from "../controller/contentController.js";
import {
    getUserContent,
    deleteContent,
    updateContent,
    scheduleContent,
    getScheduledContent,
    updateSchedule,
    cancelSchedule,
    getContentAnalytics
} from "../controller/contentController.js";

const router = express.Router();

router.post(
    "/generate",
    authMiddleware,
    generateContent
);
router.get("/", authMiddleware, getUserContent);
router.get("/analytics", authMiddleware, getContentAnalytics);
router.get("/scheduled", authMiddleware, getScheduledContent);
router.delete("/:id", authMiddleware, deleteContent);
router.put("/:id", authMiddleware, updateContent);
router.patch("/:id/schedule", authMiddleware, updateSchedule);
router.patch("/:id/cancel-schedule", authMiddleware, cancelSchedule);
router.patch("/:id/schedule", authMiddleware, scheduleContent);
export default router;