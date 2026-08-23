import api from "./api";

export const getAssistantResponse = async (message) => {
    const response = await api.post("/assistant", {
        message,
    });

    return response.data;
};
export const getDashboardGreeting = async () => {
    const response = await api.get(
        "/assistant/dashboard-greeting"
    );

    return response.data;
};