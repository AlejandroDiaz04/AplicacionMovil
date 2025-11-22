import api from "./api";

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  isDeleted?: boolean;
  existe?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const categoriasService = {
  // Obtener solo categorías activas (no eliminadas)
  obtenerTodas: async () => {
    try {
      const response = await api.get("/categorias", {
        params: { isDeleted: "false", take: 1000 },
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error("❌ [CATEGORIAS] Error obteniendo:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data.data;
  },
};
