/*
  Warnings:

  - You are about to drop the column `createdAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentDetails` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingDetails` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `orders` table. All the data in the column will be lost.
  - The values [CONFIRMED,DELIVERED] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `shippingInfo` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `createdAt`,
    DROP COLUMN `orderDate`,
    DROP COLUMN `paymentDetails`,
    DROP COLUMN `shippingDetails`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `paymentProof` VARCHAR(191) NULL,
    ADD COLUMN `shippingInfo` JSON NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
