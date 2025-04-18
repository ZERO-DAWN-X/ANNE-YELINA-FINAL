-- AlterTable
ALTER TABLE `users` ADD COLUMN `address` JSON NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;
