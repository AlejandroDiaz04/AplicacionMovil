// Actualiza la firma de crear para aceptar campos opcionales
import api from "./api";

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClienteData {
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
}

export const clientesService = {
  // Obtener solo clientes no eliminados (isDeleted=false)
  obtenerTodos: async (busqueda?: string) => {
    const params = busqueda
      ? { search: busqueda, isDeleted: "false" }
      : { isDeleted: "false" };
    const response = await api.get("/clientes", { params });
    return response.data.data || [];
  },

  obtenerPorId: async (id: number) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data.data;
  },

  // <-- CAMBIO: ahora acepta Partial<CreateClienteData>
  crear: async (datos: Partial<CreateClienteData>) => {
    try {
      console.log("📡 [CLIENTES] Creando cliente:", datos);
      const response = await api.post("/clientes", datos);
      console.log("✅ [CLIENTES] Cliente creado:", response.data);
      return response.data.data ?? response.data;
    } catch (error: any) {
      console.error(
        "❌ [CLIENTES] Error creando cliente:",
        error?.response?.status,
        error?.response?.data ?? error.message
      );
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message;
      throw new Error(
        typeof backendMessage === "string"
          ? backendMessage
          : JSON.stringify(backendMessage)
      );
    }
  },

  actualizar: async (id: number, datos: Partial<CreateClienteData>) => {
    const response = await api.put(`/clientes/${id}`, datos);
    return response.data.data ?? response.data;
  },

  // Soft delete (el backend cambia isDeleted=true)
  eliminar: async (id: number) => {
    try {
      console.log("🗑️ [CLIENTES] Eliminando cliente (soft delete):", id);
      const response = await api.delete(`/clientes/${id}`);
      console.log("✅ [CLIENTES] Cliente eliminado:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ [CLIENTES] Error eliminando:",
        error?.response?.data || error.message
      );
      throw error;
    }
  },

  // Restaurar cliente eliminado (cambiar isDeleted a false)
  restaurar: async (id: number) => {
    try {
      console.log("♻️ [CLIENTES] Restaurando cliente:", id);
      const response = await api.patch(`/clientes/${id}/restaurar`);
      console.log("✅ [CLIENTES] Cliente restaurado:", response.data);
      return response.data.data ?? response.data;
    } catch (error: any) {
      console.error(
        "❌ [CLIENTES] Error restaurando:",
        error?.response?.data || error.message
      );
      throw error;
    }
  },
};
