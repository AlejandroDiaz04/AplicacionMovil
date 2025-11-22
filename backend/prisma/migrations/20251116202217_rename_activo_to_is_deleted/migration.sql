/*
  Warnings:

  - You are about to rename the column `activo` to `is_deleted` and invert its logic on multiple tables.

*/
-- Step 1: Rename column activo to is_deleted in all tables
ALTER TABLE "usuarios" RENAME COLUMN "activo" TO "is_deleted";
ALTER TABLE "categorias" RENAME COLUMN "activo" TO "is_deleted";
ALTER TABLE "productos" RENAME COLUMN "activo" TO "is_deleted";
ALTER TABLE "listas_precios" RENAME COLUMN "activo" TO "is_deleted";
ALTER TABLE "clientes" RENAME COLUMN "activo" TO "is_deleted";

-- Step 2: Invert the logic (activo=true becomes is_deleted=false)
-- NOT operator inverts: true -> false, false -> true
UPDATE "usuarios" SET "is_deleted" = NOT "is_deleted";
UPDATE "categorias" SET "is_deleted" = NOT "is_deleted";
UPDATE "productos" SET "is_deleted" = NOT "is_deleted";
UPDATE "listas_precios" SET "is_deleted" = NOT "is_deleted";
UPDATE "clientes" SET "is_deleted" = NOT "is_deleted";
