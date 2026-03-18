-- Add 5 material fields to order_items
ALTER TABLE `order_items`
  ADD COLUMN `paperType` VARCHAR(50) NULL,
  ADD COLUMN `backing` VARCHAR(50) NULL,
  ADD COLUMN `adhesive` VARCHAR(50) NULL,
  ADD COLUMN `thickness` VARCHAR(20) NULL,
  ADD COLUMN `manufacturer` VARCHAR(100) NULL;

