/*
  Warnings:

  - You are about to drop the column `total` on the `orders` table. All the data in the column will be lost.
  - Added the required column `totalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- DropIndex
DROP INDEX `orders_userId_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `total`,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL;
