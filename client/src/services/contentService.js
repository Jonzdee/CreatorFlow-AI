import api from "./api";

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
    const response = await api.delete(`/content/${id}`);

    return response.data;
};
export const updateUserContent = async (id, data) => {
    const response = await api.put(`/content/${id}`, data);

    return response.data;
};

export const scheduleUserContent = async (id, scheduledAt) => {
    const response = await api.patch(`/content/${id}/schedule`, {
        scheduledAt,
    });

    return response.data;
};

export const getScheduledContent = async () => {
    const response = await api.get("/content/scheduled");

    return response.data;
};

export const updateSchedule = async (id, scheduledAt) => {
    const response = await api.patch(
        `/content/${id}/schedule`,
        { scheduledAt }
    );

    return response.data;
};

export const cancelSchedule = async (id) => {
    const response = await api.patch(
        `/content/${id}/cancel-schedule`
    );

    return response.data;
};

export const getContentAnalytics = async () => {
    const response = await api.get("/content/analytics");

    return response.data;
};