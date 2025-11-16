import React, { useState, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  clientesService,
  CreateClienteData,
} from "../../../services/clienteService";

// Función para calcular el dígito verificador del RUC paraguayo
const calcularDV = (ruc: string): string => {
  if (!ruc || ruc.length === 0) return "";

  const baseMax = 11;
  let k = 2;
  let total = 0;

  // Recorrer de derecha a izquierda
  for (let i = ruc.length - 1; i >= 0; i--) {
    if (k > baseMax) k = 2;
    total += parseInt(ruc[i]) * k;
    k++;
  }

  const resto = total % 11;
  return resto > 1 ? String(11 - resto) : "0";
};

export default function CrearClienteScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ruc: "",
    dv: "",
    nombre: "",
    tipoDocIdentidad: "Cedula Paraguaya",
    direccion: "",
    numeroCasa: "",
    telefono: "",
    email: "",
    contacto: "",
  });

  // Calcular DV automáticamente cuando cambia el RUC
  useEffect(() => {
    if (formData.ruc) {
      const dvCalculado = calcularDV(formData.ruc);
      setFormData((prev) => ({ ...prev, dv: dvCalculado }));
    } else {
      setFormData((prev) => ({ ...prev, dv: "" }));
    }
  }, [formData.ruc]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    // Validaciones
    if (!formData.ruc.trim()) {
      Alert.alert("Error", "El RUC es obligatorio");
      return;
    }

    if (!formData.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    // Si hay dirección, el número de casa es obligatorio
    if (formData.direccion.trim() && !formData.numeroCasa.trim()) {
      Alert.alert(
        "Error",
        "Si ingresa dirección, el número de casa es obligatorio"
      );
      return;
    }

    try {
      setLoading(true);

      // Construir el documento completo (RUC-DV)
      const documentoCompleto = `${formData.ruc.trim()}-${formData.dv}`;

      const payload: any = {
        nombre: formData.nombre.trim(),
        documento: documentoCompleto,
      };

      // Campos opcionales
      if (formData.direccion.trim()) {
        payload.direccion = `${formData.direccion.trim()} ${formData.numeroCasa.trim()}`;
      }
      if (formData.telefono.trim()) payload.telefono = formData.telefono.trim();
      if (formData.email.trim()) payload.email = formData.email.trim();

      console.log("📡 [CLIENTES] Creando cliente:", payload);

      await clientesService.crear(payload);

      Alert.alert("Éxito", "Cliente creado correctamente");
      router.back();
    } catch (error: any) {
      console.error("❌ [CLIENTES] Error creando cliente:", error);
      Alert.alert("Error", error?.message || "No se pudo crear el cliente");
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
        {/* RUC y DV */}
        <View style={styles.field}>
          <Text style={styles.labelRequerido}>RUC *</Text>
          <View style={styles.rucContainer}>
            <TextInput
              style={[styles.input, styles.rucInput]}
              placeholder="Ej: 80012345"
              value={formData.ruc}
              onChangeText={(value) =>
                handleChange("ruc", value.replace(/\D/g, ""))
              }
              keyboardType="numeric"
              editable={!loading}
              maxLength={8}
            />
            <Text style={styles.separator}>-</Text>
            <TextInput
              style={[styles.input, styles.dvInput]}
              placeholder="DV"
              value={formData.dv}
              editable={false}
              maxLength={1}
            />
          </View>
          <Text style={styles.hint}>
            El dígito verificador se calcula automáticamente
          </Text>
        </View>

        {/* Nombre */}
        <View style={styles.field}>
          <Text style={styles.labelRequerido}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo del cliente"
            value={formData.nombre}
            onChangeText={(value) => handleChange("nombre", value)}
            editable={!loading}
          />
        </View>

        {/* Tipo de Documento de Identidad */}
        <View style={styles.field}>
          <Text style={styles.labelRequerido}>Tipo Doc. Identidad *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.tipoDocIdentidad}
              onValueChange={(value: string) =>
                handleChange("tipoDocIdentidad", value)
              }
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Cédula Paraguaya" value="Cedula Paraguaya" />
              <Picker.Item label="Pasaporte" value="Pasaporte" />
              <Picker.Item
                label="Cédula Extranjera"
                value="Cedula Extranjera"
              />
              <Picker.Item label="Innominado" value="Innominado" />
              <Picker.Item
                label="Tarjeta Diplomática"
                value="Tarjeta Diplomatica"
              />
            </Picker>
          </View>
        </View>

        {/* Dirección */}
        <View style={styles.field}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Calle y nombre"
            value={formData.direccion}
            onChangeText={(value) => handleChange("direccion", value)}
            editable={!loading}
          />
        </View>

        {/* Número de Casa */}
        <View style={styles.field}>
          <Text
            style={
              formData.direccion.trim() ? styles.labelRequerido : styles.label
            }
          >
            Número de Casa {formData.direccion.trim() ? "*" : ""}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={formData.numeroCasa}
            onChangeText={(value) => handleChange("numeroCasa", value)}
            editable={!loading}
          />
          {formData.direccion.trim() && (
            <Text style={styles.hint}>
              Requerido cuando se ingresa dirección
            </Text>
          )}
        </View>

        {/* Teléfono */}
        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 0981123456"
            value={formData.telefono}
            onChangeText={(value) => handleChange("telefono", value)}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Contacto */}
        <View style={styles.field}>
          <Text style={styles.label}>Contacto</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de contacto"
            value={formData.contacto}
            onChangeText={(value) => handleChange("contacto", value)}
            keyboardType="phone-pad"
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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#2196F3",
    alignItems: "center",
    paddingVertical: 30,
  },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#fff", marginTop: 10 },
  form: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 8,
    padding: 15,
    elevation: 3,
  },
  field: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  labelRequerido: {
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
    backgroundColor: "#fff",
  },
  rucContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rucInput: {
    flex: 3,
  },
  separator: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
  },
  dvInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontWeight: "bold",
  },
  hint: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  acciones: { flexDirection: "row", gap: 10, padding: 15 },
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
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: "#fff", fontWeight: "600", fontSize: 14 },
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
  botonCancelarTexto: { color: "#2196F3", fontWeight: "600", fontSize: 14 },
});
