/*
  Warnings:

  - You are about to alter the column `nombre` on the `categorias` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `ciudad` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `departamento` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_fantasia` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `numero_documento` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `pais` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `razon_social` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `ruc` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_documento` on the `clientes` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `telefono` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `nombre` on the `listas_precios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `precios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `descuento_porcentaje` on the `precios` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `precios` table. All the data in the column will be lost.
  - You are about to drop the column `lista_precio_id` on the `precios` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `precios` table. All the data in the column will be lost.
  - You are about to drop the column `producto_id` on the `precios` table. All the data in the column will be lost.
  - You are about to drop the column `vigente_desde` on the `precios` table. All the data in the column will be lost.
  - You are about to drop the column `vigente_hasta` on the `precios` table. All the data in the column will be lost.
  - You are about to drop the column `categoria_id` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `iva_incluido` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `porcentaje_iva` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `precio_base` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `stock_actual` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `stock_minimo` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_medida` on the `productos` table. All the data in the column will be lost.
  - You are about to alter the column `codigo` on the `productos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `nombre` on the `productos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `nombre` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password_hash` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `rol` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `cliente_id` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_emision` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_vencimiento` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `numero_factura` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `sifen_cdc` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `sifen_estado` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `sifen_fecha_aprobacion` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `sifen_fecha_envio` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `sifen_response` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `sifen_xml` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_factura` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `total_descuento` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `total_general` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `total_iva_10` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `total_iva_5` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `ventas` table. All the data in the column will be lost.
  - You are about to alter the column `subtotal` on the `ventas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Decimal(12,2)`.
  - You are about to alter the column `estado` on the `ventas` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the `venta_detalles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `categorias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documento]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `listas_precios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numeroFactura]` on the table `ventas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `categorias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documento` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `listas_precios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listaPreciosId` to the `precios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioVenta` to the `precios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productoId` to the `precios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `precios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioBase` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iva` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroFactura` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `ventas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "precios" DROP CONSTRAINT "precios_lista_precio_id_fkey";

-- DropForeignKey
ALTER TABLE "precios" DROP CONSTRAINT "precios_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_categoria_id_fkey";

-- DropForeignKey
ALTER TABLE "venta_detalles" DROP CONSTRAINT "venta_detalles_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "venta_detalles" DROP CONSTRAINT "venta_detalles_venta_id_fkey";

-- DropForeignKey
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_usuario_id_fkey";

-- DropIndex
DROP INDEX "clientes_numero_documento_key";

-- DropIndex
DROP INDEX "precios_producto_id_lista_precio_id_vigente_desde_key";

-- DropIndex
DROP INDEX "ventas_numero_factura_key";

-- AlterTable
ALTER TABLE "categorias" ADD COLUMN     "existe" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "clientes" DROP COLUMN "ciudad",
DROP COLUMN "departamento",
DROP COLUMN "nombre_fantasia",
DROP COLUMN "numero_documento",
DROP COLUMN "pais",
DROP COLUMN "razon_social",
DROP COLUMN "ruc",
DROP COLUMN "tipo_documento",
ADD COLUMN     "documento" VARCHAR(50) NOT NULL,
ADD COLUMN     "nombre" VARCHAR(255) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "listas_precios" ADD COLUMN     "descuentoPorcentaje" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "precios" DROP CONSTRAINT "precios_pkey",
DROP COLUMN "descuento_porcentaje",
DROP COLUMN "id",
DROP COLUMN "lista_precio_id",
DROP COLUMN "precio",
DROP COLUMN "producto_id",
DROP COLUMN "vigente_desde",
DROP COLUMN "vigente_hasta",
ADD COLUMN     "listaPreciosId" INTEGER NOT NULL,
ADD COLUMN     "precioVenta" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "productoId" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "precios_pkey" PRIMARY KEY ("listaPreciosId", "productoId");

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "categoria_id",
DROP COLUMN "iva_incluido",
DROP COLUMN "porcentaje_iva",
DROP COLUMN "precio_base",
DROP COLUMN "stock_actual",
DROP COLUMN "stock_minimo",
DROP COLUMN "unidad_medida",
ADD COLUMN     "categoriaId" INTEGER,
ADD COLUMN     "ivaIncluido" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "porcentajeIva" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "precioBase" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "stockActual" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockMinimo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unidadMedida" VARCHAR(50) NOT NULL DEFAULT 'UNI',
ALTER COLUMN "codigo" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password_hash" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "rol" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "ventas" DROP COLUMN "cliente_id",
DROP COLUMN "fecha_emision",
DROP COLUMN "fecha_vencimiento",
DROP COLUMN "numero_factura",
DROP COLUMN "sifen_cdc",
DROP COLUMN "sifen_estado",
DROP COLUMN "sifen_fecha_aprobacion",
DROP COLUMN "sifen_fecha_envio",
DROP COLUMN "sifen_response",
DROP COLUMN "sifen_xml",
DROP COLUMN "tipo_factura",
DROP COLUMN "total_descuento",
DROP COLUMN "total_general",
DROP COLUMN "total_iva_10",
DROP COLUMN "total_iva_5",
DROP COLUMN "usuario_id",
ADD COLUMN     "clienteId" INTEGER NOT NULL,
ADD COLUMN     "fecha_venta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "iva" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "numeroFactura" VARCHAR(100) NOT NULL,
ADD COLUMN     "total" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL,
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "estado" SET DEFAULT 'pendiente',
ALTER COLUMN "estado" SET DATA TYPE VARCHAR(50);

-- DropTable
DROP TABLE "venta_detalles";

-- CreateTable
CREATE TABLE "detalles_venta" (
    "id" SERIAL NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnit" DECIMAL(10,2) NOT NULL,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "iva" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalles_venta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_documento_key" ON "clientes"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "listas_precios_nombre_key" ON "listas_precios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ventas_numeroFactura_key" ON "ventas"("numeroFactura");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios" ADD CONSTRAINT "precios_listaPreciosId_fkey" FOREIGN KEY ("listaPreciosId") REFERENCES "listas_precios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precios" ADD CONSTRAINT "precios_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_venta" ADD CONSTRAINT "detalles_venta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
