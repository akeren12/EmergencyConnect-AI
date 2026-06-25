import api from "./axios";

export const getTips = () =>
    api.get("/api/emergency/tips/");