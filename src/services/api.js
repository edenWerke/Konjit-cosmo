import axios from "axios";

// Render backend (public). VITE_API_URL from Vercel or .env.production overrides this.
const PRODUCTION_API_BASE =
  "https://ecommerce-cosmotic-website.onrender.com/api";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PRODUCTION_API_BASE : "http://localhost:5000/api");

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;