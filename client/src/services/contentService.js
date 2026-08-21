import api from "./api";

/*
|--------------------------------------------------------------------------
| Content
|--------------------------------------------------------------------------
*/

export const generateContent = async (data) => {
    const response = await api.post(
        "/content/generate",
        data
    );

    return response.data;
};

export const getUserContent = async () => {
    const response = await api.get("/content");

    return response.data;
};

export const deleteUserContent = async (id) => {
    const response = await api.delete(
        `/content/${id}`
    );

    return response.data;
};

export const updateUserContent = async (id, data) => {
    const response = await api.put(
        `/content/${id}`,
        data
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Scheduling
|--------------------------------------------------------------------------
*/

export const scheduleUserContent = async (
    id,
    scheduledAt
) => {
    const response = await api.patch(
        `/content/${id}/schedule`,
        {
            scheduledAt,
        }
    );

    return response.data;
};

export const getScheduledContent = async () => {
    const response = await api.get(
        "/content/scheduled"
    );

    return response.data;
};

export const updateSchedule = async (
    id,
    scheduledAt
) => {
    const response = await api.patch(
        `/content/${id}/reschedule`,
        {
            scheduledAt,
        }
    );

    return response.data;
};

export const cancelSchedule = async (id) => {
    const response = await api.patch(
        `/content/${id}/cancel-schedule`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

export const getContentAnalytics = async () => {
    const response = await api.get(
        "/content/analytics"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Draft
|--------------------------------------------------------------------------
*/

export const getLatestDraftContent = async () => {
    const response = await api.get(
        "/content/latest-draft"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Cloudinary
|--------------------------------------------------------------------------
*/

/*
| Get signed Cloudinary upload data from backend
*/

export const getUploadSignature = async () => {
    const response = await api.post(
        "/content/media/signature"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Upload file directly to Cloudinary
|--------------------------------------------------------------------------
*/

export const uploadFileToCloudinary = async (
    file,
    signatureData
) => {
    const {
        signature,
        timestamp,
        folder,
        cloudName,
        apiKey,
    } = signatureData;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const resourceType = file.type.startsWith("video/")
        ? "video"
        : "image";

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message ||
            "Cloudinary upload failed"
        );
    }

    return data;
};

/*
|--------------------------------------------------------------------------
| Attach uploaded media to content
|--------------------------------------------------------------------------
*/

export const attachMediaToContent = async (
    id,
    media
) => {
    const response = await api.put(
        `/content/${id}/media`,
        {
            media,
        }
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Remove media from content
|--------------------------------------------------------------------------
|
| Deletes the media from Cloudinary through the backend
| and removes its reference from MongoDB.
|
*/

export const removeMediaFromContent = async (
    id,
    publicId
) => {
    const response = await api.delete(
        `/content/${id}/media`,
        {
            data: {
                publicId,
            },
        }
    );

    return response.data;
};