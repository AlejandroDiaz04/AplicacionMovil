import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Text,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { productosService, Producto } from "../../../services/productoService";

export default function ProductosScreen() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useFocusEffect(
    useCallback(() => {
      cargarProductos();
    }, [])
  );

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await productosService.obtenerTodos();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarProductos();
    setRefreshing(false);
  };

  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
    const filtered = productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(texto.toLowerCase()) ||
        (producto.marca &&
          producto.marca.nombre.toLowerCase().includes(texto.toLowerCase())) ||
        (producto.grupo &&
          producto.grupo.nombre.toLowerCase().includes(texto.toLowerCase()))
    );
    setFilteredProductos(filtered);
  };

  const handleEliminar = (id: number, nombre: string) => {
    Alert.alert(
      "Eliminar Producto",
      `¿Estás seguro de que deseas eliminar "${nombre}"?\n\nEsta acción se puede deshacer más tarde.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              setLoading(true);
              await productosService.eliminar(id);

              // Recargar la lista completa desde el servidor
              await cargarProductos();

              Alert.alert("Éxito", "Producto eliminado correctamente");
            } catch (error: any) {
              console.error("❌ [PRODUCTOS] Error eliminando:", error);
              Alert.alert(
                "Error",
                error?.response?.data?.message ||
                  "No se pudo eliminar el producto"
              );
            } finally {
              setLoading(false);
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

  const renderProductoItem = ({ item }: { item: Producto }) => (
    <View style={styles.productoCard}>
      <View style={styles.productoInfo}>
        <View style={styles.headerCard}>
          <Text style={styles.productoNombre}>{item.nombre}</Text>
        </View>
        <Text style={styles.productoCodigo}>Código: {item.codigo}</Text>
        <View style={styles.detallesRow}>
          {item.marca && (
            <Text style={styles.productoDetalle}>🏷️ {item.marca.nombre}</Text>
          )}
          {item.grupo && (
            <Text style={styles.productoDetalle}>📦 {item.grupo.nombre}</Text>
          )}
        </View>
        <View style={styles.stockRow}>
          <Text style={styles.productoStock}>
            Stock: {item.stockActual} {item.unidadMedida}
          </Text>
          {item.categoria && (
            <Text style={styles.productoCategoria}>
              {item.categoria.nombre}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.acciones}>
        <TouchableOpacity
          style={styles.btnVer}
          onPress={() => router.push(`/(drawer)/productos/${item.id}` as any)}
        >
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() =>
            router.push(`/(drawer)/productos/editar/${item.id}` as any)
          }
        >
          <MaterialIcons name="edit" size={20} color="#FFA500" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnEliminar}
          onPress={() => handleEliminar(item.id, item.nombre)}
        >
          <MaterialIcons name="delete" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          value={busqueda}
          onChangeText={handleBusqueda}
          placeholderTextColor="#999"
        />
        {busqueda !== "" && (
          <TouchableOpacity onPress={() => handleBusqueda("")}>
            <MaterialIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de productos */}
      {filteredProductos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="inventory" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No hay productos</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProductos}
          renderItem={renderProductoItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Botón flotante para agregar producto */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push("/(drawer)/productos/crear" as any)}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    padding: 10,
  },
  productoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productoInfo: {
    flex: 1,
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  productoCodigo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  productoPrecio: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  detallesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  productoDetalle: {
    fontSize: 12,
    color: "#999",
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productoStock: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  productoCategoria: {
    fontSize: 11,
    color: "#2196F3",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  acciones: {
    flexDirection: "row",
    gap: 8,
  },
  btnVer: {
    padding: 8,
  },
  btnEditar: {
    padding: 8,
  },
  btnEliminar: {
    padding: 8,
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
  },
});
