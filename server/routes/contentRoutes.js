import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateContent } from "../controller/contentController.js";

const router = express.Router();

router.post(
    "/generate",
    authMiddleware,
    generateContent
);

export default router;