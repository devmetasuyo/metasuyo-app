/*
  Warnings:

  - The primary key for the `facturas` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "detalle_factura" DROP CONSTRAINT "detalle_factura_factura_id_fkey";

-- AlterTable
ALTER TABLE "detalle_factura" ALTER COLUMN "factura_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "facturas" DROP CONSTRAINT "facturas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "facturas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "facturas_id_seq";

-- AddForeignKey
ALTER TABLE "detalle_factura" ADD CONSTRAINT "detalle_factura_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
