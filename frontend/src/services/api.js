import axios from "axios";

// ==========================================
// AXIOS CONFIGURATION
// ==========================================

const api = axios.create({
    baseURL: "https://researchos1.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 120000,
});


// ==========================================
// START NEW RESEARCH
// ==========================================

export const startResearch = async (topic) => {
    try {
        const response = await api.post("/research/start", {
            topic: topic,
        });

        return response.data;

    } catch (error) {
        console.error(
            "Start Research API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// GET ALL RESEARCH HISTORY
// ==========================================

export const getHistory = async () => {
    try {
        const response = await api.get("/history/");

        return response.data;

    } catch (error) {
        console.error(
            "History API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// GET SINGLE RESEARCH REPORT
// ==========================================

export const getReport = async (reportId) => {
    try {
        const response = await api.get(
            `/history/${reportId}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "Get Report API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// DELETE RESEARCH REPORT
// ==========================================

export const deleteReport = async (reportId) => {
    try {
        const response = await api.delete(
            `/history/${reportId}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "Delete Report API Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// HEALTH CHECK
// ==========================================

export const checkHealth = async () => {
    try {
        const response = await api.get("/health");

        return response.data;

    } catch (error) {
        console.error(
            "Health Check Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ==========================================
// DEFAULT AXIOS INSTANCE
// ==========================================

export default api;