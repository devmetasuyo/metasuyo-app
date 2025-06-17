-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL DEFAULT '',
    "correo" VARCHAR(100) NOT NULL,
    "creado_el" DATE DEFAULT CURRENT_TIMESTAMP,
    "actualizado_el" DATE DEFAULT CURRENT_TIMESTAMP,
    "telefono" VARCHAR(15),
    "direccion" TEXT,
    "wallet" VARCHAR,
    "tipo_documento" TEXT NOT NULL DEFAULT 'DNI',
    "documento" VARCHAR(15),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos_en_factura" (
    "id" SERIAL NOT NULL,
    "factura_id" TEXT,
    "creado_el" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_el" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "producto_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "sub_total" DECIMAL(10,5) NOT NULL,

    CONSTRAINT "productos_en_factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" TEXT NOT NULL,
    "cliente_id" UUID,
    "wallet" TEXT,
    "hash" TEXT NOT NULL DEFAULT 'N/A',
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,5) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "estado_sunat" TEXT NOT NULL DEFAULT 'pendiente',
    "serie_sunat" TEXT,
    "correlativo_sunat" TEXT,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "categoria" VARCHAR(100) NOT NULL,
    "precio" DECIMAL(10,5) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL DEFAULT '/icon.png',
    "descripcion" TEXT NOT NULL,
    "creado_el" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_el" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productos_en_factura" ADD CONSTRAINT "productos_en_factura_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos_en_factura" ADD CONSTRAINT "productos_en_factura_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
