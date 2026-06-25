import api from "./axios";

export const getReports = () =>
    api.get("/api/emergency/reports/");

export const createReport = (data) =>
    api.post("/api/emergency/reports/", data);