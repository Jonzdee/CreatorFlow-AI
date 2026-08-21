import express from "express";

import {
    createIdea,
    getIdeas,
    getIdea,
    updateIdea,
    deleteIdea,
} from "../controller/ideaController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createIdea);

router.get("/", authMiddleware, getIdeas);

router.get("/:id", authMiddleware, getIdea);

router.put("/:id", authMiddleware, updateIdea);

router.delete("/:id", authMiddleware, deleteIdea);

export default router;