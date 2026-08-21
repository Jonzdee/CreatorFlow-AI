import Idea from "../models/Idea.js";


// CREATE IDEA
export const createIdea = async (req, res) => {
    try {
        const userId = req.user.id;

        const { title, description, platform, contentType } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Idea title is required",
            });
        }

        const idea = await Idea.create({
            user: userId,
            title: title.trim(),
            description: description?.trim() || "",
            platform: platform || "",
            contentType: contentType || "",
        });

        res.status(201).json({
            success: true,
            message: "Idea saved successfully",
            data: idea,
        });
    } catch (error) {
        console.error("Create idea error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save idea",
        });
    }
};


// GET USER IDEAS
export const getIdeas = async (req, res) => {
    try {
        const userId = req.user.id;

        const ideas = await Idea.find({
            user: userId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            data: ideas,
        });
    } catch (error) {
        console.error("Get ideas error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load ideas",
        });
    }
};


// GET SINGLE IDEA
export const getIdea = async (req, res) => {
    try {
        const userId = req.user.id;

        const idea = await Idea.findOne({
            _id: req.params.id,
            user: userId,
        });

        if (!idea) {
            return res.status(404).json({
                success: false,
                message: "Idea not found",
            });
        }

        res.status(200).json({
            success: true,
            data: idea,
        });
    } catch (error) {
        console.error("Get idea error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load idea",
        });
    }
};


// UPDATE IDEA
export const updateIdea = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            title,
            description,
            platform,
            contentType,
        } = req.body;

        const idea = await Idea.findOneAndUpdate(
            {
                _id: req.params.id,
                user: userId,
            },
            {
                title,
                description,
                platform,
                contentType,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!idea) {
            return res.status(404).json({
                success: false,
                message: "Idea not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Idea updated successfully",
            data: idea,
        });
    } catch (error) {
        console.error("Update idea error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update idea",
        });
    }
};


// DELETE IDEA
export const deleteIdea = async (req, res) => {
    try {
        const userId = req.user.id;

        const idea = await Idea.findOneAndDelete({
            _id: req.params.id,
            user: userId,
        });

        if (!idea) {
            return res.status(404).json({
                success: false,
                message: "Idea not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Idea deleted successfully",
        });
    } catch (error) {
        console.error("Delete idea error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete idea",
        });
    }
};