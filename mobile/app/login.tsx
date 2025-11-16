import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.17:3000/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("alejandrodiaz04zr@gmail.com");
  const [password, setPassword] = useState("administrador123");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      console.log("📡 [LOGIN] Intentando login con:", email);

      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log("✅ [LOGIN] Respuesta:", response.data);

      // El backend devuelve { success, message, token, user } directamente
      const { token, user } = response.data;

      if (!token) {
        throw new Error("Token no recibido del servidor");
      }

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("✅ [LOGIN] Token guardado, redirigiendo...");

      // Esperar un momento para que AsyncStorage termine de escribir
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Forzar navegación inmediata
      setLoading(false);
      router.replace("/(drawer)/clientes" as any);
    } catch (error: any) {
      console.error("❌ [LOGIN] Error:", error.response?.data || error.message);
      Alert.alert(
        "Error de Login",
        error.response?.data?.message || "Credenciales inválidas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="dashboard" size={80} color="#2196F3" />
          <Text style={styles.title}>Sistema de Ventas</Text>
          <Text style={styles.subtitle}>Inicia Sesión</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color="#2196F3"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#2196F3"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#2196F3"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="login" size={20} color="#fff" />
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2196F3",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    gap: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  version: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 30,
  },
});
