import api from "./api";

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoriaId?: number;
  grupoId?: number;
  marcaId?: number;
  unidadMedida: string;
  ivaIncluido: boolean;
  porcentajeIva: number;
  stockActual: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  categoria?: {
    id: number;
    nombre: string;
  };
  grupo?: {
    id: number;
    nombre: string;
  };
  marca?: {
    id: number;
    nombre: string;
  };
}

export interface CreateProductoData {
  codigo: string;
  nombre: string;
  categoriaId?: number;
  grupoId?: number;
  marcaId?: number;
  unidadMedida?: string;
  ivaIncluido?: boolean;
  porcentajeIva?: number;
}

export const productosService = {
  // Obtener solo productos no eliminados (isDeleted=false)
  obtenerTodos: async (busqueda?: string) => {
    try {
      const params = busqueda
        ? { search: busqueda, isDeleted: "false" }
        : { isDeleted: "false" };
      const response = await api.get("/productos", { params });
      return response.data.data || [];
    } catch (error: any) {
      console.error("❌ [PRODUCTOS] Error obteniendo:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error("❌ [PRODUCTOS] Error obteniendo por ID:", error);
      throw error;
    }
  },

  crear: async (datos: CreateProductoData) => {
    try {
      console.log("📡 [PRODUCTOS] Creando producto:", datos);
      const response = await api.post("/productos", datos);
      console.log("✅ [PRODUCTOS] Producto creado:", response.data);
      return response.data.data ?? response.data;
    } catch (error: any) {
      console.error(
        "❌ [PRODUCTOS] Error creando:",
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

  actualizar: async (id: number, datos: Partial<CreateProductoData>) => {
    try {
      console.log("📡 [PRODUCTOS] Actualizando producto:", id, datos);
      const response = await api.put(`/productos/${id}`, datos);
      console.log("✅ [PRODUCTOS] Producto actualizado:", response.data);
      return response.data.data ?? response.data;
    } catch (error: any) {
      console.error(
        "❌ [PRODUCTOS] Error actualizando:",
        error?.response?.data || error.message
      );
      throw error;
    }
  },

  // Soft delete (el backend cambia isDeleted=true)
  eliminar: async (id: number) => {
    try {
      console.log("🗑️ [PRODUCTOS] Eliminando producto (soft delete):", id);
      const response = await api.delete(`/productos/${id}`);
      console.log("✅ [PRODUCTOS] Producto eliminado:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ [PRODUCTOS] Error eliminando:",
        error?.response?.data || error.message
      );
      throw error;
    }
  },

  // Buscar por código
  buscarPorCodigo: async (codigo: string) => {
    try {
      const response = await api.get(`/productos/buscar`, {
        params: { codigo },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("❌ [PRODUCTOS] Error buscando por código:", error);
      throw error;
    }
  },
};
