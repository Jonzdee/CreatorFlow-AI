import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    createUploadSignature,
} from "../controller/mediaController.js";

const router = express.Router();

router.get(
    "/signature",
    authMiddleware,
    createUploadSignature
);

export default router;