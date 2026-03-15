-- AlterTable
ALTER TABLE `estimate_items` ADD COLUMN `quantityText` VARCHAR(50) NULL,
    ADD COLUMN `unitPriceText` VARCHAR(50) NULL,
    ADD COLUMN `vat` DECIMAL(12, 0) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `estimates` ADD COLUMN `recipientText` VARCHAR(200) NULL,
    ADD COLUMN `totalAmount` DECIMAL(12, 0) NOT NULL DEFAULT 0,
    ADD COLUMN `totalVat` DECIMAL(12, 0) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `tightRoll` BOOLEAN NOT NULL DEFAULT false;
