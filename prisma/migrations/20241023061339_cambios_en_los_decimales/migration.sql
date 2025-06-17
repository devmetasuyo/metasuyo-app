/*
  Warnings:

  - You are about to alter the column `total` on the `facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,5)`.
  - You are about to alter the column `precio` on the `productos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,5)`.
  - You are about to alter the column `sub_total` on the `productos_en_factura` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,5)`.

*/
-- AlterTable
ALTER TABLE "facturas" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,5);

-- AlterTable
ALTER TABLE "productos" ALTER COLUMN "precio" SET DATA TYPE DECIMAL(10,5);

-- AlterTable
ALTER TABLE "productos_en_factura" ALTER COLUMN "sub_total" SET DATA TYPE DECIMAL(10,5);
