/*
  Warnings:

  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentSlip` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingInfo` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orders` table. All the data in the column will be lost.
  - Added the required column `paymentDetails` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingDetails` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `created_at`,
    DROP COLUMN `paymentSlip`,
    DROP COLUMN `shippingInfo`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `paymentDetails` JSON NOT NULL,
    ADD COLUMN `shippingDetails` JSON NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
