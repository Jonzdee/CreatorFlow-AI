import express from "express";

import {
    getNotifications,
    markNotificationRead,
} from "../controller/notificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.patch("/:id/read", authMiddleware, markNotificationRead);

export default router;