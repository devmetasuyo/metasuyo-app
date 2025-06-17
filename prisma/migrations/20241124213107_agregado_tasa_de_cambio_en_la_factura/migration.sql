/*
  Warnings:

  - Added the required column `tasa_dollar` to the `facturas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "facturas" ADD COLUMN     "tasa_dollar" DECIMAL(10,5) NOT NULL;
