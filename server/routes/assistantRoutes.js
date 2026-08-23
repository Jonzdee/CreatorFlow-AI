import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { assistantChat } from "../controller/assistantController.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    assistantChat
);

export default router;