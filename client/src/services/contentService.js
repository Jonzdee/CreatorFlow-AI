import api from "./api";

export const generateContent = async (data) => {
    const response = await api.post(
        "/content/generate",
        data
    );

    return response.data;
};