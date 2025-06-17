-- AlterTable
ALTER TABLE "facturas" ADD COLUMN "wallet" TEXT,
ALTER COLUMN "estado" SET DEFAULT 'pendiente';
