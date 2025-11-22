import api from "./api";

export interface Grupo {
  id: number;
  nombre: string;
  descripcion?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGrupoData {
  nombre: string;
  descripcion?: string;
}

export const gruposService = {
  async obtenerTodos(busqueda?: string): Promise<Grupo[]> {
    const params: any = { isDeleted: false, take: 1000 };
    if (busqueda) params.busqueda = busqueda;

    const { data } = await api.get("/grupos", { params });
    console.log("📦 [GRUPOS] Grupos obtenidos:", data?.data?.length || 0);
    return data?.data || [];
  },

  async obtenerPorId(id: number): Promise<Grupo> {
    const { data } = await api.get(`/grupos/${id}`);
    console.log("📦 [GRUPOS] Grupo obtenido:", data?.data?.nombre);
    return data?.data || data;
  },

  async crear(datos: CreateGrupoData): Promise<Grupo> {
    console.log("📦 [GRUPOS] Creando grupo:", datos);
    const { data } = await api.post("/grupos", datos);
    return data?.data || data;
  },

  async actualizar(
    id: number,
    datos: Partial<CreateGrupoData>
  ): Promise<Grupo> {
    console.log("📦 [GRUPOS] Actualizando grupo:", id, datos);
    const { data } = await api.put(`/grupos/${id}`, datos);
    return data?.data || data;
  },

  async eliminar(id: number): Promise<void> {
    console.log("📦 [GRUPOS] Eliminando grupo:", id);
    await api.delete(`/grupos/${id}`);
  },
};
