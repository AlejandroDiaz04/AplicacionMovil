import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { clientesService } from "@/services/clienteService";

export default function CrearClienteScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    direccion: "",
    ciudad: "",
    estado: "",
    pais: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleGuardar = async () => {
    if (!formData.nombre || !formData.email) {
      Alert.alert("Error", "Nombre y Email son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await clientesService.crear(formData);
      Alert.alert("Éxito", "Cliente creado correctamente");
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el cliente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="person-add" size={50} color="#2196F3" />
        <Text style={styles.titulo}>Crear Nuevo Cliente</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={formData.nombre}
            onChangeText={(value) => handleChange("nombre", value)}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="+1234567890"
            value={formData.telefono}
            onChangeText={(value) => handleChange("telefono", value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Empresa</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la empresa"
            value={formData.empresa}
            onChangeText={(value) => handleChange("empresa", value)}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Calle y número"
            value={formData.direccion}
            onChangeText={(value) => handleChange("direccion", value)}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ciudad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ciudad"
            value={formData.ciudad}
            onChangeText={(value) => handleChange("ciudad", value)}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estado/Provincia</Text>
          <TextInput
            style={styles.input}
            placeholder="Estado o Provincia"
            value={formData.estado}
            onChangeText={(value) => handleChange("estado", value)}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>País</Text>
          <TextInput
            style={styles.input}
            placeholder="País"
            value={formData.pais}
            onChangeText={(value) => handleChange("pais", value)}
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity
          style={[styles.boton, loading && styles.botonDeshabilitado]}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color="#fff" />
              <Text style={styles.botonTexto}>Guardar</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonCancelar}
          onPress={() => router.back()}
          disabled={loading}
        >
          <MaterialIcons name="close" size={20} color="#2196F3" />
          <Text style={styles.botonCancelarTexto}>Cancelar</Text>
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
  header: {
    backgroundColor: "#2196F3",
    alignItems: "center",
    paddingVertical: 30,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  form: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 8,
    padding: 15,
    elevation: 3,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  acciones: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
  },
  boton: {
    flex: 1,
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  botonCancelar: {
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
  botonCancelarTexto: {
    color: "#2196F3",
    fontWeight: "600",
    fontSize: 14,
  },
});
