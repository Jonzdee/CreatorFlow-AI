import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    generateContent,
    getUserContent,
    deleteContent,
    updateContent,
    scheduleContent,
    getScheduledContent,
    updateSchedule,
    cancelSchedule,
    getContentAnalytics,
    getLatestDraftContent,
} from "../controller/contentController.js";

import {
    createUploadSignature,
    attachMedia,
    removeMedia,
} from "../controller/mediaController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Content
|--------------------------------------------------------------------------
*/

router.post(
    "/generate",
    authMiddleware,
    generateContent
);

router.get(
    "/",
    authMiddleware,
    getUserContent
);

router.get(
    "/analytics",
    authMiddleware,
    getContentAnalytics
);

router.get(
    "/scheduled",
    authMiddleware,
    getScheduledContent
);

router.get(
    "/latest-draft",
    authMiddleware,
    getLatestDraftContent
);

/*
|--------------------------------------------------------------------------
| Media
|--------------------------------------------------------------------------
*/

// Generate signed Cloudinary upload data
router.post(
    "/media/signature",
    authMiddleware,
    createUploadSignature
);

// Attach uploaded Cloudinary media to content
router.put(
    "/:id/media",
    authMiddleware,
    attachMedia
);

// Remove media from Cloudinary + MongoDB
router.delete(
    "/:id/media",
    authMiddleware,
    removeMedia
);

/*
|--------------------------------------------------------------------------
| Content CRUD
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    authMiddleware,
    deleteContent
);

router.put(
    "/:id",
    authMiddleware,
    updateContent
);

/*
|--------------------------------------------------------------------------
| Scheduling
|--------------------------------------------------------------------------
*/

// Schedule a draft
router.patch(
    "/:id/schedule",
    authMiddleware,
    scheduleContent
);

// Reschedule an already scheduled post
router.patch(
    "/:id/reschedule",
    authMiddleware,
    updateSchedule
);

// Cancel schedule
router.patch(
    "/:id/cancel-schedule",
    authMiddleware,
    cancelSchedule
);

export default router;