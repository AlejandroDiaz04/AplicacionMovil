import api from "./api";

export interface Marca {
  id: number;
  nombre: string;
  descripcion?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarcaData {
  nombre: string;
  descripcion?: string;
}

export const marcasService = {
  async obtenerTodas(busqueda?: string): Promise<Marca[]> {
    const params: any = { isDeleted: false, take: 1000 };
    if (busqueda) params.busqueda = busqueda;

    const { data } = await api.get("/marcas", { params });
    console.log("🏷️ [MARCAS] Marcas obtenidas:", data?.data?.length || 0);
    return data?.data || [];
  },

  async obtenerPorId(id: number): Promise<Marca> {
    const { data } = await api.get(`/marcas/${id}`);
    console.log("🏷️ [MARCAS] Marca obtenida:", data?.data?.nombre);
    return data?.data || data;
  },

  async crear(datos: CreateMarcaData): Promise<Marca> {
    console.log("🏷️ [MARCAS] Creando marca:", datos);
    const { data } = await api.post("/marcas", datos);
    return data?.data || data;
  },

  async actualizar(
    id: number,
    datos: Partial<CreateMarcaData>
  ): Promise<Marca> {
    console.log("🏷️ [MARCAS] Actualizando marca:", id, datos);
    const { data } = await api.put(`/marcas/${id}`, datos);
    return data?.data || data;
  },

  async eliminar(id: number): Promise<void> {
    console.log("🏷️ [MARCAS] Eliminando marca:", id);
    await api.delete(`/marcas/${id}`);
  },
};
