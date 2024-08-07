/*
  Warnings:

  - Added the required column `itemPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "itemPrice" DECIMAL(65,30) NOT NULL;
