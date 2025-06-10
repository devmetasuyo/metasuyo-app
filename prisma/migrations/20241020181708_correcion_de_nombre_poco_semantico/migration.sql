/*
  Warnings:

  - You are about to drop the `_detalle_facturaToproductos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalle_factura` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_detalle_facturaToproductos" DROP CONSTRAINT "_detalle_facturaToproductos_A_fkey";

-- DropForeignKey
ALTER TABLE "_detalle_facturaToproductos" DROP CONSTRAINT "_detalle_facturaToproductos_B_fkey";

-- DropForeignKey
ALTER TABLE "detalle_factura" DROP CONSTRAINT "detalle_factura_factura_id_fkey";

-- DropTable
DROP TABLE "_detalle_facturaToproductos";

-- DropTable
DROP TABLE "detalle_factura";

-- CreateTable
CREATE TABLE "productos_en_factura" (
    "id" SERIAL NOT NULL,
    "factura_id" TEXT,
    "creado_el" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_el" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "sub_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "productos_en_factura_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productos_en_factura" ADD CONSTRAINT "productos_en_factura_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos_en_factura" ADD CONSTRAINT "productos_en_factura_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
