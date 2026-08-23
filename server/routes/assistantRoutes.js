import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { assistantChat } from "../controller/assistantController.js";
import {
    
    getDashboardGreeting,
} from "../controller/assistantController.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    assistantChat
);

router.get(
    "/dashboard-greeting",
    authMiddleware,
    getDashboardGreeting
);
export default router;