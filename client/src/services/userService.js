import api from "./api";

export const completeOnboarding = async (data) => {
    const response = await api.put("/users/onboarding", data);

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/users/me");

    return response.data;
};