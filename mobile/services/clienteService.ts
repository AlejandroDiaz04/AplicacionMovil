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
  activo: boolean;
  createdAt: string;
  updatedAt: string;
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
  // ============================================
  // OBTENER TODOS LOS CLIENTES
  // ============================================
  obtenerTodos: async (busqueda?: string) => {
    try {
      console.log("📡 [CLIENTES] Obteniendo todos los clientes...");
      const params = busqueda ? { search: busqueda } : {};
      const response = await api.get("/clientes", { params });
      console.log("✅ [CLIENTES] Clientes obtenidos:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ [CLIENTES] Error obteniendo clientes:", error);
      throw error;
    }
  },

  // ============================================
  // OBTENER CLIENTE POR ID
  // ============================================
  obtenerPorId: async (id: number) => {
    try {
      console.log(`📡 [CLIENTES] Obteniendo cliente ${id}...`);
      const response = await api.get(`/clientes/${id}`);
      console.log("✅ [CLIENTES] Cliente obtenido:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(`❌ [CLIENTES] Error obteniendo cliente ${id}:`, error);
      throw error;
    }
  },

  // ============================================
  // CREAR CLIENTE
  // ============================================
  crear: async (datos: CreateClienteData) => {
    try {
      console.log("📡 [CLIENTES] Creando cliente:", datos);
      const response = await api.post("/clientes", datos);
      console.log("✅ [CLIENTES] Cliente creado:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ [CLIENTES] Error creando cliente:", error);
      throw error;
    }
  },

  // ============================================
  // ACTUALIZAR CLIENTE
  // ============================================
  actualizar: async (id: number, datos: Partial<CreateClienteData>) => {
    try {
      console.log(`📡 [CLIENTES] Actualizando cliente ${id}:`, datos);
      const response = await api.put(`/clientes/${id}`, datos);
      console.log("✅ [CLIENTES] Cliente actualizado:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(`❌ [CLIENTES] Error actualizando cliente ${id}:`, error);
      throw error;
    }
  },

  // ============================================
  // ELIMINAR CLIENTE
  // ============================================
  eliminar: async (id: number) => {
    try {
      console.log(`📡 [CLIENTES] Eliminando cliente ${id}...`);
      const response = await api.delete(`/clientes/${id}`);
      console.log("✅ [CLIENTES] Cliente eliminado");
      return true;
    } catch (error) {
      console.error(`❌ [CLIENTES] Error eliminando cliente ${id}:`, error);
      throw error;
    }
  },
};
