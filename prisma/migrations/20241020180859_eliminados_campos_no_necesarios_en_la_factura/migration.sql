/*
  Warnings:

  - You are about to drop the column `precio_unitario` on the `detalle_factura` table. All the data in the column will be lost.
  - You are about to drop the column `producto_id` on the `detalle_factura` table. All the data in the column will be lost.
  - Added the required column `total` to the `detalle_factura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detalle_factura" DROP COLUMN "precio_unitario",
DROP COLUMN "producto_id",
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL;
