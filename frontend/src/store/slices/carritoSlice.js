import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
  iva: 0,
  subtotal: 0,
};

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    agregarProducto: (state, action) => {
      const producto = action.payload;
      const existe = state.items.find((item) => item.id === producto.id);

      if (existe) {
        existe.cantidad += producto.cantidad || 1;
      } else {
        state.items.push({
          ...producto,
          cantidad: producto.cantidad || 1,
        });
      }

      // Recalcular totales
      carritoSlice.caseReducers.recalcularTotales(state);
    },

    modificarCantidad: (state, action) => {
      const { productoId, cantidad } = action.payload;
      const item = state.items.find((item) => item.id === productoId);

      if (item) {
        if (cantidad <= 0) {
          state.items = state.items.filter((item) => item.id !== productoId);
        } else {
          item.cantidad = cantidad;
        }
      }

      carritoSlice.caseReducers.recalcularTotales(state);
    },

    eliminarProducto: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      carritoSlice.caseReducers.recalcularTotales(state);
    },

    limpiarCarrito: (state) => {
      state.items = [];
      state.total = 0;
      state.iva = 0;
      state.subtotal = 0;
    },

    recalcularTotales: (state) => {
      let subtotal = 0;
      let iva = 0;

      state.items.forEach((item) => {
        const precioUnitario = parseFloat(item.precioBase) || 0;
        const cantidad = item.cantidad || 0;
        const subtotalItem = precioUnitario * cantidad;

        subtotal += subtotalItem;

        if (item.ivaIncluido) {
          const ivaItem =
            (subtotalItem * (item.porcentajeIva || 10)) /
            (100 + (item.porcentajeIva || 10));
          iva += ivaItem;
        } else {
          const ivaItem = (subtotalItem * (item.porcentajeIva || 10)) / 100;
          iva += ivaItem;
        }
      });

      state.subtotal = parseFloat(subtotal.toFixed(2));
      state.iva = parseFloat(iva.toFixed(2));
      state.total = parseFloat((state.subtotal + state.iva).toFixed(2));
    },
  },
});

export const {
  agregarProducto,
  modificarCantidad,
  eliminarProducto,
  limpiarCarrito,
} = carritoSlice.actions;
export default carritoSlice.reducer;
