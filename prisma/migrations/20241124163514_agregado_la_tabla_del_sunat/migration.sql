/*
  Warnings:

  - The primary key for the `facturas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `factura_id` column on the `productos_en_factura` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `facturas` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "productos_en_factura" DROP CONSTRAINT "productos_en_factura_factura_id_fkey";

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "documento" VARCHAR(15),
ADD COLUMN     "tipo_documento" TEXT NOT NULL DEFAULT 'DNI';

-- AlterTable
ALTER TABLE "facturas" DROP CONSTRAINT "facturas_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "facturas_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "productos_en_factura" DROP COLUMN "factura_id",
ADD COLUMN     "factura_id" UUID;

-- CreateTable
CREATE TABLE "sunat_en_factura" (
    "id" SERIAL NOT NULL,
    "estado_sunat" TEXT NOT NULL DEFAULT 'pendiente',
    "serie_sunat" TEXT,
    "facturaId" UUID,

    CONSTRAINT "sunat_en_factura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sunat_en_factura_facturaId_key" ON "sunat_en_factura"("facturaId");

-- AddForeignKey
ALTER TABLE "productos_en_factura" ADD CONSTRAINT "productos_en_factura_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sunat_en_factura" ADD CONSTRAINT "sunat_en_factura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "facturas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
