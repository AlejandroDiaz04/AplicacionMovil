import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authService = {
  // ============================================
  // LOGIN
  // ============================================
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Guardar token y datos del usuario
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error.response?.data || { message: error.message };
    }
  },

  // ============================================
  // REGISTER
  // ============================================
  register: async (nombre, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        nombre,
        email,
        password,
      });

      if (response.data.success) {
        return response.data;
      }
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
      const response = await api.get("/auth/profile");
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
