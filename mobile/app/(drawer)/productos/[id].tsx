import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { productosService, Producto } from "../../../services/productoService";
import { useFocusEffect } from "@react-navigation/native";

export default function DetalleProductoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const data = await productosService.obtenerPorId(Number(id));
      setProducto(data);
    } catch (error) {
      console.error("Error cargando producto:", error);
      Alert.alert("Error", "No se pudo cargar el producto");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => {
    if (!producto) return;

    Alert.alert(
      "Eliminar Producto",
      `¿Estás seguro de que deseas eliminar "${producto.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await productosService.eliminar(producto.id);
              Alert.alert("Éxito", "Producto eliminado correctamente");
              router.replace("/(drawer)/productos" as any);
            } catch (error) {
              console.error("Error eliminando producto:", error);
              Alert.alert("Error", "No se pudo eliminar el producto");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatearPrecio = (precio: number) => {
    return `₲ ${Number(precio).toLocaleString("es-PY")}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!producto) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="inventory-2" size={60} color="#fff" />
        <Text style={styles.headerTitle}>{producto.nombre}</Text>
        <Text style={styles.headerSubtitle}>Código: {producto.codigo}</Text>
      </View>

      <View style={styles.content}>
        {/* Stock */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="inventory" size={24} color="#2196F3" />
            <Text style={styles.cardTitle}>Stock</Text>
          </View>
          <View style={styles.stockRow}>
            <View>
              <Text style={styles.label}>Stock Actual</Text>
              <Text style={styles.stockValue}>
                {producto.stockActual} {producto.unidadMedida}
              </Text>
            </View>
          </View>
        </View>

        {/* Información General */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="info" size={24} color="#FF9800" />
            <Text style={styles.cardTitle}>Información General</Text>
          </View>

          {producto.categoria && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoría:</Text>
              <Text style={styles.infoValue}>{producto.categoria.nombre}</Text>
            </View>
          )}

          {producto.grupo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Grupo:</Text>
              <Text style={styles.infoValue}>{producto.grupo.nombre}</Text>
            </View>
          )}

          {producto.marca && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Marca:</Text>
              <Text style={styles.infoValue}>{producto.marca.nombre}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Unidad de Medida:</Text>
            <Text style={styles.infoValue}>{producto.unidadMedida}</Text>
          </View>
        </View>

        {/* Fechas */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="calendar-today" size={24} color="#9C27B0" />
            <Text style={styles.cardTitle}>Fechas</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Creado:</Text>
            <Text style={styles.infoValue}>
              {new Date(producto.createdAt!).toLocaleDateString("es-PY")}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Última actualización:</Text>
            <Text style={styles.infoValue}>
              {new Date(producto.updatedAt!).toLocaleDateString("es-PY")}
            </Text>
          </View>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.acciones}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() =>
            router.push(`/(drawer)/productos/editar/${producto.id}` as any)
          }
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.btnTexto}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}>
          <MaterialIcons name="delete" size={20} color="#fff" />
          <Text style={styles.btnTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E8F5E9",
    marginTop: 5,
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  precio: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 10,
  },
  hint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2196F3",
  },
  stockBajo: {
    color: "#FF6B6B",
  },
  alerta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    gap: 8,
  },
  alertaTexto: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  acciones: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
  },
  btnEditar: {
    flex: 1,
    backgroundColor: "#FF9800",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  btnEliminar: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  btnTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
