import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.0.17:3000/api";

console.log("🔧 API BASE URL CONFIGURADA:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST
api.interceptors.request.use(
  async (config) => {
    console.log("📤 REQUEST:", config.method.toUpperCase(), config.url);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error obteniendo token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ RESPONSE ERROR:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      AsyncStorage.removeItem("userToken");
      AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
