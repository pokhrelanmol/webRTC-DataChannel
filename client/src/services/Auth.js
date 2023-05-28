import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

export const logIn = (formData) => API.post("/api/v1/auth/login", formData);

export const register = (formData) =>
    API.post("/api/v1/auth/register", formData);
