-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `oldPrice` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `imageGallery` JSON NOT NULL,
    `filterItems` JSON NOT NULL,
    `colors` JSON NULL,
    `isNew` BOOLEAN NOT NULL DEFAULT false,
    `isSale` BOOLEAN NOT NULL DEFAULT false,
    `isStocked` BOOLEAN NOT NULL DEFAULT true,
    `productNumber` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
