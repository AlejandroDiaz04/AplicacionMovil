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
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  productosService,
  Producto,
} from "../../../../services/productoService";
import {
  categoriasService,
  Categoria,
} from "../../../../services/categoriaService";
import { gruposService, Grupo } from "../../../../services/grupoService";
import { marcasService, Marca } from "../../../../services/marcaService";

// Unidades de medida fijas
const UNIDADES_MEDIDA = [
  { label: "Unidad", value: "UNI" },
  { label: "Gramos", value: "GR" },
  { label: "Kilogramos", value: "KG" },
  { label: "Pack", value: "PACK" },
  { label: "Litros", value: "LT" },
  { label: "Paquetes", value: "PAQ" },
];

// Porcentajes de IVA disponibles
const PORCENTAJES_IVA = [
  { label: "0%", value: 0 },
  { label: "5%", value: 5 },
  { label: "10%", value: 10 },
];

export default function EditarProductoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    categoriaId: "",
    grupoId: "",
    marcaId: "",
    unidadMedida: "UNI",
    ivaIncluido: true,
    porcentajeIva: 10,
  });

  useEffect(() => {
    cargarCategorias();
    cargarGrupos();
    cargarMarcas();
    cargarProducto();
  }, [id]);

  const cargarCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const data = await categoriasService.obtenerTodas();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const cargarGrupos = async () => {
    try {
      setLoadingGrupos(true);
      const data = await gruposService.obtenerTodos();
      setGrupos(data);
    } catch (error) {
      console.error("Error cargando grupos:", error);
    } finally {
      setLoadingGrupos(false);
    }
  };

  const cargarMarcas = async () => {
    try {
      setLoadingMarcas(true);
      const data = await marcasService.obtenerTodas();
      setMarcas(data);
    } catch (error) {
      console.error("Error cargando marcas:", error);
    } finally {
      setLoadingMarcas(false);
    }
  };

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const producto: Producto = await productosService.obtenerPorId(
        Number(id)
      );

      setFormData({
        codigo: producto.codigo,
        nombre: producto.nombre,
        categoriaId: producto.categoriaId?.toString() || "",
        grupoId: producto.grupoId?.toString() || "",
        marcaId: producto.marcaId?.toString() || "",
        unidadMedida: producto.unidadMedida,
        ivaIncluido: producto.ivaIncluido,
        porcentajeIva: producto.porcentajeIva,
      });
    } catch (error) {
      console.error("Error cargando producto:", error);
      Alert.alert("Error", "No se pudo cargar el producto");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardar = async () => {
    // Validaciones
    if (!formData.nombre.trim()) {
      Alert.alert("Error", "El nombre del producto es obligatorio");
      return;
    }

    try {
      setSaving(true);

      const payload: any = {
        nombre: formData.nombre.trim(),
        unidadMedida: formData.unidadMedida,
        ivaIncluido: formData.ivaIncluido,
        porcentajeIva: formData.porcentajeIva,
      };

      // Campos opcionales
      if (formData.categoriaId)
        payload.categoriaId = parseInt(formData.categoriaId);
      if (formData.grupoId) payload.grupoId = parseInt(formData.grupoId);
      if (formData.marcaId) payload.marcaId = parseInt(formData.marcaId);

      console.log("📡 [PRODUCTOS] Actualizando producto:", payload);

      await productosService.actualizar(Number(id), payload);

      Alert.alert("Éxito", "Producto actualizado correctamente");
      router.back();
    } catch (error: any) {
      console.error("❌ [PRODUCTOS] Error actualizando producto:", error);
      Alert.alert(
        "Error",
        error?.message || "No se pudo actualizar el producto"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="edit" size={50} color="#FF9800" />
        <Text style={styles.titulo}>Editar Producto</Text>
      </View>

      <View style={styles.form}>
        {/* Código de barras (solo lectura) */}
        <View style={styles.field}>
          <Text style={styles.label}>Código de Barras</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={formData.codigo}
            editable={false}
          />
          <Text style={styles.hint}>El código no se puede modificar</Text>
        </View>

        {/* Nombre */}
        <View style={styles.field}>
          <Text style={styles.labelRequerido}>Descripción (Nombre) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChangeText={(value) => handleChange("nombre", value)}
            editable={!saving}
          />
        </View>

        {/* Categoría */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          {loadingCategorias ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.categoriaId}
                onValueChange={(value: string) =>
                  handleChange("categoriaId", value)
                }
                enabled={!saving}
                style={styles.picker}
              >
                <Picker.Item label="Sin categoría" value="" />
                {categorias.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={cat.nombre}
                    value={cat.id.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Grupo */}
        <View style={styles.field}>
          <Text style={styles.label}>Grupo</Text>
          {loadingGrupos ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.grupoId}
                onValueChange={(value: string) =>
                  handleChange("grupoId", value)
                }
                enabled={!saving}
                style={styles.picker}
              >
                <Picker.Item label="Sin grupo" value="" />
                {grupos.map((grupo) => (
                  <Picker.Item
                    key={grupo.id}
                    label={grupo.nombre}
                    value={grupo.id.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Marca */}
        <View style={styles.field}>
          <Text style={styles.label}>Marca</Text>
          {loadingMarcas ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.marcaId}
                onValueChange={(value: string) =>
                  handleChange("marcaId", value)
                }
                enabled={!saving}
                style={styles.picker}
              >
                <Picker.Item label="Sin marca" value="" />
                {marcas.map((marca) => (
                  <Picker.Item
                    key={marca.id}
                    label={marca.nombre}
                    value={marca.id.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Unidad de Medida */}
        <View style={styles.field}>
          <Text style={styles.labelRequerido}>Unidad de Medida *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.unidadMedida}
              onValueChange={(value: string) =>
                handleChange("unidadMedida", value)
              }
              enabled={!saving}
              style={styles.picker}
            >
              {UNIDADES_MEDIDA.map((unidad) => (
                <Picker.Item
                  key={unidad.value}
                  label={unidad.label}
                  value={unidad.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* IVA Incluido */}
        <View style={styles.field}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Impuesto al IVA (Incluido)</Text>
            <Switch
              value={formData.ivaIncluido}
              onValueChange={(value) => handleChange("ivaIncluido", value)}
              disabled={saving}
              trackColor={{ false: "#ccc", true: "#4CAF50" }}
              thumbColor={formData.ivaIncluido ? "#FF9800" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.hint}>
            {formData.ivaIncluido
              ? "Los precios incluirán el IVA"
              : "Los precios NO incluirán el IVA"}
          </Text>
        </View>

        {/* Porcentaje IVA */}
        <View style={styles.field}>
          <Text style={styles.labelRequerido}>Porcentaje de IVA *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.porcentajeIva}
              onValueChange={(value: number) =>
                handleChange("porcentajeIva", value)
              }
              enabled={!saving}
              style={styles.picker}
            >
              {PORCENTAJES_IVA.map((iva) => (
                <Picker.Item
                  key={iva.value}
                  label={iva.label}
                  value={iva.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.acciones}>
        <TouchableOpacity
          style={[styles.boton, saving && styles.botonDeshabilitado]}
          onPress={handleGuardar}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="save" size={20} color="#fff" />
              <Text style={styles.botonTexto}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonCancelar}
          onPress={() => router.back()}
          disabled={saving}
        >
          <MaterialIcons name="close" size={20} color="#FF9800" />
          <Text style={styles.botonCancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FF9800",
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
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 60,
    marginVertical: -5,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hint: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  acciones: { flexDirection: "row", gap: 10, padding: 15 },
  boton: {
    flex: 1,
    backgroundColor: "#FF9800",
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
    borderColor: "#FF9800",
  },
  botonCancelarTexto: { color: "#FF9800", fontWeight: "600", fontSize: 14 },
});
