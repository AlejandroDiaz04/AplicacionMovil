import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Importar pantallas (las crearemos después)
// Auth Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

// Main Screens (temporales, las reemplazaremos)
import ProductosScreen from "../screens/Productos/ProductosScreen";
import CarritoScreen from "../screens/Carrito/CarritoScreen";
import VentasScreen from "../screens/Ventas/VentasScreen";
import ReportesScreen from "../screens/Reportes/ReportesScreen";
import PerfilScreen from "../screens/Perfil/PerfilScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================
// STACK NAVIGATION - AUTH
// ============================================
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animationTypeForReplace: true,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Crear Cuenta",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

// ============================================
// TAB NAVIGATION - MAIN APP
// ============================================
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="ProductosTab"
        component={ProductosScreen}
        options={{
          title: "Productos",
          tabBarLabel: "Productos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CarritoTab"
        component={CarritoScreen}
        options={{
          title: "Carrito",
          tabBarLabel: "Carrito",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="VentasTab"
        component={VentasScreen}
        options={{
          title: "Ventas",
          tabBarLabel: "Ventas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ReportesTab"
        component={ReportesScreen}
        options={{
          title: "Reportes",
          tabBarLabel: "Reportes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-box"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ============================================
// APP NAVIGATOR - MAIN
// ============================================
const AppNavigator = ({ isSignout }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isSignout ? (
        <Stack.Group screenOptions={{ animationEnabled: false }}>
          <Stack.Screen name="Auth" component={AuthStack} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
