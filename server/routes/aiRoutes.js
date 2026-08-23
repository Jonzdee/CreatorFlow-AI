import express from "express";
import { generateContent } from "../controller/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/generate",
    authMiddleware,
    generateContent
);

export default router;