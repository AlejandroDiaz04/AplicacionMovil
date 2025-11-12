import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  // ============================================
  // LOGIN
  // ============================================
  login: async (email, password) => {
    try {
      console.log("📡 URL BASE:", "http://192.168.0.17:3000/api");
      console.log(
        "📡 Endpoint completo:",
        "http://192.168.0.17:3000/api/auth/login"
      );
      console.log("📤 Datos enviando:", { email, password });

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Respuesta del servidor:", response.data);

      if (response.data.success) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error("❌ ERROR CAPTURADO:");
      console.error("   - message:", error.message);
      console.error("   - code:", error.code);
      console.error("   - status:", error.response?.status);
      console.error("   - data:", error.response?.data);
      console.error("   - config URL:", error.config?.url);
      console.error("   - config baseURL:", error.config?.baseURL);
      console.error("   - Stack:", error.stack);

      throw error.response?.data || { message: error.message };
    }
  },

  // ============================================
  // REGISTER
  // ============================================
  register: async (nombre, email, password) => {
    try {
      const response = await api.post("/auth/registrar", {
        nombre,
        email,
        password,
      });

      if (response.data.success) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error.response?.data || { message: error.message };
    }
  },

  // ============================================
  // OBTENER PERFIL
  // ============================================
  getProfile: async () => {
    try {
      const response = await api.get("/auth/perfil");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // ============================================
  // CAMBIAR CONTRASEÑA
  // ============================================
  cambiarContrasena: async (passwordActual, passwordNueva) => {
    try {
      const response = await api.post("/auth/cambiar-contrasena", {
        passwordActual,
        passwordNueva,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // ============================================
  // LOGOUT
  // ============================================
  logout: async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("user");
      return true;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // VERIFICAR SI HAY TOKEN
  // ============================================
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // ============================================
  // OBTENER TOKEN
  // ============================================
  getToken: async () => {
    try {
      return await AsyncStorage.getItem("userToken");
    } catch (error) {
      return null;
    }
  },

  // ============================================
  // OBTENER USUARIO
  // ============================================
  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
};
