/*
  Warnings:

  - A unique constraint covering the columns `[productCode]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionDate` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `transactions_createdAt_idx` ON `transactions`;

-- AlterTable
ALTER TABLE `estimates` ADD COLUMN `validDays` INTEGER NOT NULL DEFAULT 10,
    MODIFY `estimateNumber` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `cuttingType` VARCHAR(20) NULL,
    ADD COLUMN `dieCutter` VARCHAR(20) NULL,
    ADD COLUMN `labelGap` DECIMAL(4, 1) NULL,
    ADD COLUMN `resinPlate` VARCHAR(20) NULL,
    ADD COLUMN `sheetsPerSheet` VARCHAR(30) NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `clientContact` VARCHAR(50) NULL,
    ADD COLUMN `clientPhone` VARCHAR(30) NULL,
    ADD COLUMN `deliveryMethod` VARCHAR(20) NULL,
    ADD COLUMN `deliveryRegion` VARCHAR(50) NULL,
    ADD COLUMN `photoInspection` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sampleShipping` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `worker` VARCHAR(50) NULL,
    MODIFY `orderNumber` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `productCode` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `sales_records` ADD COLUMN `dataType` VARCHAR(20) NULL,
    ADD COLUMN `deliveryRegion` VARCHAR(50) NULL,
    ADD COLUMN `deliveryType` VARCHAR(20) NULL,
    ADD COLUMN `transactionType` VARCHAR(10) NULL,
    ADD COLUMN `worker` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `transactionDate` DATE NOT NULL,
    MODIFY `transactionNumber` VARCHAR(30) NOT NULL;

-- CreateTable
CREATE TABLE `materials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paperType` VARCHAR(50) NULL,
    `backing` VARCHAR(50) NULL,
    `adhesive` VARCHAR(50) NULL,
    `thickness` VARCHAR(20) NULL,
    `manufacturer` VARCHAR(100) NULL,
    `code` VARCHAR(150) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `materials_paperType_idx`(`paperType`),
    INDEX `materials_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `products_productCode_key` ON `products`(`productCode`);

-- CreateIndex
CREATE INDEX `sales_records_transactionType_idx` ON `sales_records`(`transactionType`);

-- CreateIndex
CREATE INDEX `transactions_transactionDate_idx` ON `transactions`(`transactionDate`);
