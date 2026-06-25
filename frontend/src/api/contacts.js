import api from "./axios";

export const getContacts = () =>
    api.get("/api/emergency/contacts/");

export const createContact = (data) =>
    api.post("/api/emergency/contacts/", data);

export const deleteContact = (id) =>
    api.delete(`/api/emergency/contacts/${id}/`);

export const updateContact = (id, data) =>
    api.put(`/api/emergency/contacts/${id}/`, data);