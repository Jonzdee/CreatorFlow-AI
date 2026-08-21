import api from "./api";

export const getIdeas = async () => {
    const response = await api.get("/ideas");

    return response.data;
};

export const createIdea = async (ideaData) => {
    const response = await api.post("/ideas", ideaData);

    return response.data;
};

export const updateIdea = async (id, ideaData) => {
    const response = await api.put(`/ideas/${id}`, ideaData);

    return response.data;
};

export const deleteIdea = async (id) => {
    const response = await api.delete(`/ideas/${id}`);

    return response.data;
};