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
import { clientesService, Cliente } from "../../../services/clienteService";

export default function ClientesScreen() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useFocusEffect(
    useCallback(() => {
      cargarClientes();
    }, [])
  );

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.obtenerTodos();
      setClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los clientes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarClientes();
    setRefreshing(false);
  };

  const handleBusqueda = (texto: string) => {
    setBusqueda(texto);
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        cliente.email.toLowerCase().includes(texto.toLowerCase())
    );
    setFilteredClientes(filtered);
  };

  const handleEliminar = (id: number, nombre: string) => {
    Alert.alert(
      "Eliminar Cliente",
      `¿Estás seguro de que deseas eliminar a ${nombre}?`,
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await clientesService.eliminar(id);
              Alert.alert("Éxito", "Cliente eliminado correctamente");
              cargarClientes();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el cliente");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderClienteItem = ({ item }: { item: Cliente }) => (
    <View style={styles.clienteCard}>
      <View style={styles.clienteInfo}>
        <Text style={styles.clienteNombre}>{item.nombre}</Text>
        <Text style={styles.clienteEmail}>{item.email}</Text>
        {item.telefono && (
          <Text style={styles.clienteDetalle}>📞 {item.telefono}</Text>
        )}
        {item.empresa && (
          <Text style={styles.clienteDetalle}>🏢 {item.empresa}</Text>
        )}
      </View>
      <View style={styles.acciones}>
        <TouchableOpacity
          style={styles.btnVer}
          onPress={() => router.push(`/(drawer)/clientes/${item.id}` as any)}
        >
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() =>
            router.push(`/(drawer)/clientes/editar/${item.id}` as any)
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

  if (loading) {
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
          placeholder="Buscar cliente..."
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

      {/* Lista de clientes */}
      {filteredClientes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No hay clientes</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClientes}
          renderItem={renderClienteItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Botón flotante para agregar cliente */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push("/(drawer)/clientes/crear" as any)}
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
  clienteCard: {
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
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  clienteEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  clienteDetalle: {
    fontSize: 12,
    color: "#999",
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
