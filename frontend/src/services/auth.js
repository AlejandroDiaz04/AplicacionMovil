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
};
