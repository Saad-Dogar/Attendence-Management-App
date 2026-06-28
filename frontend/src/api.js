import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Runs before every request — pulls the token from storage and attaches it
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
