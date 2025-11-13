import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { clientesService, Cliente } from "../../../services/clienteService";

export default function ClienteDetallesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCliente();
  }, [id]);

  const cargarCliente = async () => {
    try {
      setLoading(true);
      const data = await clientesService.obtenerPorId(Number(id));
      setCliente(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el cliente");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="person" size={60} color="#2196F3" />
        <Text style={styles.nombre}>{cliente.nombre}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <MaterialIcons name="email" size={20} color="#2196F3" />
          <View style={styles.info}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.valor}>{cliente.email}</Text>
          </View>
        </View>

        {cliente.telefono && (
          <View style={styles.row}>
            <MaterialIcons name="phone" size={20} color="#2196F3" />
            <View style={styles.info}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.valor}>{cliente.telefono}</Text>
            </View>
          </View>
        )}

        {cliente.empresa && (
          <View style={styles.row}>
            <MaterialIcons name="business" size={20} color="#2196F3" />
            <View style={styles.info}>
              <Text style={styles.label}>Empresa</Text>
              <Text style={styles.valor}>{cliente.empresa}</Text>
            </View>
          </View>
        )}

        {cliente.direccion && (
          <View style={styles.row}>
            <MaterialIcons name="location-on" size={20} color="#2196F3" />
            <View style={styles.info}>
              <Text style={styles.label}>Dirección</Text>
              <Text style={styles.valor}>{cliente.direccion}</Text>
            </View>
          </View>
        )}

        {cliente.ciudad && (
          <View style={styles.row}>
            <MaterialIcons name="location-city" size={20} color="#2196F3" />
            <View style={styles.info}>
              <Text style={styles.label}>Ciudad</Text>
              <Text style={styles.valor}>{cliente.ciudad}</Text>
            </View>
          </View>
        )}

        {cliente.estado && (
          <View style={styles.row}>
            <MaterialIcons name="flag" size={20} color="#2196F3" />
            <View style={styles.info}>
              <Text style={styles.label}>Estado</Text>
              <Text style={styles.valor}>{cliente.estado}</Text>
            </View>
          </View>
        )}

        {cliente.pais && (
          <View style={styles.row}>
            <MaterialIcons name="public" size={20} color="#2196F3" />
            <View style={styles.info}>
              <Text style={styles.label}>País</Text>
              <Text style={styles.valor}>{cliente.pais}</Text>
            </View>
          </View>
        )}

        <View style={styles.row}>
          <MaterialIcons name="calendar-today" size={20} color="#2196F3" />
          <View style={styles.info}>
            <Text style={styles.label}>Fecha de Registro</Text>
            <Text style={styles.valor}>
              {new Date(cliente.createdAt).toLocaleDateString("es-ES")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() =>
            router.push(`/(drawer)/clientes/editar/${cliente.id}` as any)
          }
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonVolver}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#2196F3" />
          <Text style={styles.botonVolverTexto}>Volver</Text>
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
  header: {
    backgroundColor: "#2196F3",
    alignItems: "center",
    paddingVertical: 30,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 8,
    padding: 15,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginBottom: 3,
  },
  valor: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  acciones: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
  },
  botonEditar: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  botonVolver: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  botonVolverTexto: {
    color: "#2196F3",
    fontWeight: "600",
    fontSize: 14,
  },
});
