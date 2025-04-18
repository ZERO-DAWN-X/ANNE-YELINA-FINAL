/*
  Warnings:

  - You are about to drop the column `notes` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentInfo` on the `orders` table. All the data in the column will be lost.
  - The values [SHIPPED] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `notes`,
    DROP COLUMN `paymentInfo`,
    ADD COLUMN `paymentSlip` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED') NOT NULL DEFAULT 'PENDING';
