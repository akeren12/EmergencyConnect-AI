import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://emergencyconnect-ai-production.up.railway.app";

export default axios.create({
    baseURL: `${baseURL}/api`,
});