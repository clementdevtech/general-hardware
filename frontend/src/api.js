import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Debug: log baseURL at startup
//console.log("🔍 API baseURL:", import.meta.env.VITE_API_URL);

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      //console.log("🔐 Attaching token:", config.headers.Authorization);
    } else {
      console.warn("⚠️ No token found in localStorage");
    }

    // Debug every request
    /*console.log("➡️ API Request:", {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data,
    });*/

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ API Error Response:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("❌ API Network/Other Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
