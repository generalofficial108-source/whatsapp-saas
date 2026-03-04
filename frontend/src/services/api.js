import axios from "axios";

const API = axios.create({
  baseURL: "https://whatsapp-saas-backend-4c56.onrender.com/admin"
});

export const getUsers = () => API.get("/users");
export const getMessages = (user) => API.get(`/messages/${user}`);
export const getStats = () => API.get("/stats");
export const sendMessageAPI = (data) => API.post("/send", data);

export default API;