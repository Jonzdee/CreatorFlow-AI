import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

export const completeOnboarding = async (data) => {
    const token = localStorage.getItem("token");

    const response = await axios.put(
        `${API_URL}/onboarding`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};