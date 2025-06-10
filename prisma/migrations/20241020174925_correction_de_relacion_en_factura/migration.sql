-- DropForeignKey
ALTER TABLE "detalle_factura" DROP CONSTRAINT "detalle_factura_producto_id_fkey";

-- CreateTable
CREATE TABLE "_detalle_facturaToproductos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_detalle_facturaToproductos_AB_unique" ON "_detalle_facturaToproductos"("A", "B");

-- CreateIndex
CREATE INDEX "_detalle_facturaToproductos_B_index" ON "_detalle_facturaToproductos"("B");

-- AddForeignKey
ALTER TABLE "_detalle_facturaToproductos" ADD CONSTRAINT "_detalle_facturaToproductos_A_fkey" FOREIGN KEY ("A") REFERENCES "detalle_factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_detalle_facturaToproductos" ADD CONSTRAINT "_detalle_facturaToproductos_B_fkey" FOREIGN KEY ("B") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
