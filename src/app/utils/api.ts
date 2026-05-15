import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  const isProd = import.meta.env.PROD;

  // In production, if the URL is localhost or not set, use relative path
  if (isProd) {
    if (!url || url.includes("localhost")) {
      return "/api/v1";
    }
  }

  if (!url) return "/api/v1";
  
  // Remove all trailing slashes and clean up double slashes in the path
  const cleanedUrl = url.replace(/\/+$/, "");
  
  return cleanedUrl.endsWith("/api/v1") ? cleanedUrl : `${cleanedUrl}/api/v1`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexus_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API Auth] Token attached to ${config.url}`);
  } else {
    console.warn(`[API Auth] No token found for ${config.url}`);
  }
  console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request - redirecting to login");
      localStorage.removeItem("nexus_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_email");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
