import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Start a new research
export const startResearch = async (topic) => {
    const response = await api.post("/research/start", {
        topic: topic,
    });

    return response.data;
};

// Get all saved research reports
export const getHistory = async () => {
    const response = await api.get("/history/");

    return response.data;
};

// Get one research report
export const getReport = async (reportId) => {
    const response = await api.get(`/history/${reportId}`);

    return response.data;
};

// Delete a research report
export const deleteReport = async (reportId) => {
    const response = await api.delete(`/history/${reportId}`);

    return response.data;
};

export default api;