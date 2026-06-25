import api from "./axios";

export const analyzeEmergency = (message) =>
    api.post("/api/ai/analyze/", {
        description: message,
    });