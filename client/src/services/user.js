import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api/v1" });
export const getUser = (userId) => API.get(`/user/${userId}`);
export const getAllUsers = () => API.get("/user");
