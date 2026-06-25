import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://emergencyconnect-ai-production.up.railway.app";

const api = axios.create({
    baseURL: baseURL,
});

api.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

export default api;