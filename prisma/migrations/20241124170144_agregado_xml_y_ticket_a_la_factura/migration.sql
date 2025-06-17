/*
  Warnings:

  - Made the column `serie_sunat` on table `sunat_en_factura` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sunat_en_factura" ADD COLUMN     "ticket_xml" XML,
ADD COLUMN     "xml" XML,
ALTER COLUMN "serie_sunat" SET NOT NULL;
