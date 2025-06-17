/*
  Warnings:

  - The primary key for the `clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `cliente_id` column on the `facturas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `productos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `clientes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `productos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `producto_id` on the `productos_en_factura` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "facturas" DROP CONSTRAINT "facturas_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "productos_en_factura" DROP CONSTRAINT "productos_en_factura_producto_id_fkey";

-- AlterTable
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "facturas" DROP COLUMN "cliente_id",
ADD COLUMN     "cliente_id" UUID;

-- AlterTable
ALTER TABLE "productos" DROP CONSTRAINT "productos_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "productos_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "productos_en_factura" DROP COLUMN "producto_id",
ADD COLUMN     "producto_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "productos_en_factura" ADD CONSTRAINT "productos_en_factura_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
