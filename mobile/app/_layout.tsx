import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "@/hooks/use-color-scheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Verificar autenticación al iniciar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("🔍 [ROOT] Verificando token:", token ? "SÍ" : "NO");
      setIsAuthenticated(!!token);
    } catch (e) {
      console.error("❌ [ROOT] Error verificando autenticación:", e);
      setIsAuthenticated(false);
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  // Re-verificar cuando la app vuelve al foco O cuando cambian los segmentos
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 [ROOT] App enfocada, re-verificando auth...");
      checkAuth();
    }, [])
  );

  // También verificar cuando cambian los segmentos
  useEffect(() => {
    if (isReady) {
      console.log("🔄 [ROOT] Segmentos cambiaron, re-verificando auth...");
      checkAuth();
    }
  }, [segments]);

  // Proteger rutas según autenticación
  useEffect(() => {
    if (!isReady || isAuthenticated === null) return;

    const inAuthGroup = segments[0] === "(drawer)";
    const inLogin = segments[0] === "login" || segments.length === 1;

    console.log("🔍 [ROOT] Segmentos:", segments, "Auth:", isAuthenticated);

    if (!isAuthenticated && inAuthGroup) {
      console.log("⚠️ [ROOT] Sin auth en drawer, redirigiendo a login");
      router.replace("/login" as any);
    } else if (isAuthenticated && inLogin) {
      console.log("✅ [ROOT] Con auth en login, redirigiendo a drawer");
      router.replace("/(drawer)/clientes" as any);
    }
  }, [isReady, isAuthenticated, segments]);

  if (!isReady || isAuthenticated === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
