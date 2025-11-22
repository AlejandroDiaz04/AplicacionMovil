-- AlterTable
ALTER TABLE "categorias" ALTER COLUMN "is_deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "clientes" ALTER COLUMN "is_deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "listas_precios" ALTER COLUMN "is_deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "grupo" VARCHAR(255),
ADD COLUMN     "marca" VARCHAR(255),
ALTER COLUMN "is_deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "is_deleted" SET DEFAULT false;
