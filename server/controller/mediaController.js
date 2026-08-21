import cloudinary from "../config/cloudinary.js";
import Content from "../models/Content.js";

const MAX_MEDIA_FILES = 10;

const ALLOWED_RESOURCE_TYPES = ["image", "video"];

const validateMediaItem = (item) => {
    if (!item || typeof item !== "object") {
        return "Invalid media item.";
    }

    if (!item.url || typeof item.url !== "string") {
        return "Media URL is required.";
    }

    if (!item.publicId || typeof item.publicId !== "string") {
        return "Media public ID is required.";
    }

    if (
        !item.resourceType ||
        !ALLOWED_RESOURCE_TYPES.includes(item.resourceType)
    ) {
        return "Invalid media resource type.";
    }

    return null;
};

/*
|--------------------------------------------------------------------------
| Create Cloudinary Upload Signature
|--------------------------------------------------------------------------
*/

export const createUploadSignature = async (req, res) => {
    try {
        const timestamp = Math.round(Date.now() / 1000);

        const folder = `creatorflow/users/${req.user.id}`;

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        return res.status(200).json({
            success: true,
            data: {
                signature,
                timestamp,
                folder,
                cloudName: process.env.CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.CLOUDINARY_API_KEY,
            },
        });
    } catch (error) {
        console.error("Cloudinary signature error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create upload signature",
        });
    }
};

/*
|--------------------------------------------------------------------------
| Attach Media To Content
|--------------------------------------------------------------------------
*/

export const attachMedia = async (req, res) => {
    try {
        const { media } = req.body || {};

        if (!Array.isArray(media)) {
            return res.status(400).json({
                success: false,
                message: "Media must be an array.",
            });
        }

        if (media.length > MAX_MEDIA_FILES) {
            return res.status(400).json({
                success: false,
                message: `A maximum of ${MAX_MEDIA_FILES} media files is allowed.`,
            });
        }

        for (const item of media) {
            const validationError = validateMediaItem(item);

            if (validationError) {
                return res.status(400).json({
                    success: false,
                    message: validationError,
                });
            }
        }

        const content = await Content.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found.",
            });
        }

        content.media = media;

        await content.save();

        return res.status(200).json({
            success: true,
            message: "Media attached successfully.",
            data: content,
        });
    } catch (error) {
        console.error("Attach media error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to attach media.",
        });
    }
};

/*
|--------------------------------------------------------------------------
| Remove Media
|--------------------------------------------------------------------------
*/

export const removeMedia = async (req, res) => {
    try {
        const { publicId } = req.body || {};

        if (!publicId || typeof publicId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Media public ID is required.",
            });
        }

        const content = await Content.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found.",
            });
        }

        const mediaItem = content.media.find(
            (item) => item.publicId === publicId
        );

        if (!mediaItem) {
            return res.status(404).json({
                success: false,
                message: "Media not found.",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Delete from Cloudinary
        |--------------------------------------------------------------------------
        */

        const cloudinaryResult = await cloudinary.uploader.destroy(
            mediaItem.publicId,
            {
                resource_type: mediaItem.resourceType,
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Cloudinary normally returns:
        | "ok"      -> deleted
        | "not found" -> already gone
        |--------------------------------------------------------------------------
        */

        if (
            cloudinaryResult.result !== "ok" &&
            cloudinaryResult.result !== "not found"
        ) {
            console.error(
                "Cloudinary deletion failed:",
                cloudinaryResult
            );

            return res.status(500).json({
                success: false,
                message: "Failed to remove media from storage.",
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Remove reference from MongoDB
        |--------------------------------------------------------------------------
        */

        content.media = content.media.filter(
            (item) => item.publicId !== publicId
        );

        await content.save();

        return res.status(200).json({
            success: true,
            message: "Media removed successfully.",
            data: content,
        });
    } catch (error) {
        console.error("Remove media error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove media.",
        });
    }
};