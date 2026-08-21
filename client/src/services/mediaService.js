import api from "./api";

export const getUploadSignature = async () => {
    const response = await api.get("/media/upload-signature");

    return response.data;
};

export const uploadMedia = async (contentId, file) => {
    // 1. Get Cloudinary signature
    const signatureResponse = await getUploadSignature();

    const {
        signature,
        timestamp,
        folder,
        cloudName,
        apiKey,
    } = signatureResponse.data;

    // 2. Prepare Cloudinary upload
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    // 3. Upload directly to Cloudinary
    const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!cloudinaryResponse.ok) {
        throw new Error("Cloudinary upload failed");
    }

    const cloudinaryData = await cloudinaryResponse.json();

    // 4. Build media object
    const mediaItem = {
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
        resourceType: cloudinaryData.resource_type,
        originalName: file.name,
        format: cloudinaryData.format || "",
        width: cloudinaryData.width || null,
        height: cloudinaryData.height || null,
        duration: cloudinaryData.duration || null,
    };

    // 5. Attach media to MongoDB
    const contentResponse = await attachMediaToContent(
        contentId,
        [mediaItem]
    );

    return contentResponse;
};