import api from "./axios";

export const loginUser = (data) =>
    api.post("/api/users/login/", data);

export const registerUser = (data) =>
    api.post("/api/users/register/", data);