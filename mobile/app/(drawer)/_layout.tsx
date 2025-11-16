import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerNavigationEventMap } from "@react-navigation/drawer";
import { NavigationState, ParamListBase } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

function CustomDrawerContent(props: any) {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sí, cerrar",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("🔓 [LOGOUT] Cerrando sesión...");
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("user");
            console.log("✅ [LOGOUT] Tokens eliminados");

            // Usar replace para forzar la navegación y limpiar el stack
            router.replace("/login" as any);
          } catch (error) {
            console.error("❌ [LOGOUT] Error cerrando sesión:", error);
            Alert.alert("Error", "No se pudo cerrar la sesión correctamente");
          }
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Sistema de Ventas</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "left",
          headerTintColor: "#2196F3",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          drawerActiveTintColor: "#2196F3",
          drawerInactiveTintColor: "#666",
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="clientes"
          options={{
            title: "Clientes",
            drawerLabel: "Clientes",
            headerTitle: "Gestión de Clientes",
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="people" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="productos/index"
          options={{
            title: "Productos",
            drawerLabel: "Productos",
            headerTitle: "Gestión de Productos",
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="shopping-bag" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="ventas/index"
          options={{
            title: "Ventas",
            drawerLabel: "Ventas",
            headerTitle: "Registro de Ventas",
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="trending-up" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="reportes/index"
          options={{
            title: "Reportes",
            drawerLabel: "Reportes",
            headerTitle: "Reportes",
            drawerIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="assessment" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#2196F3",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: "auto",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
