/*
  Warnings:

  - You are about to alter the column `status` on the `books` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `books` ADD COLUMN `paymmentCycle` ENUM('monthly', 'quarterly', 'yearly') NOT NULL DEFAULT 'monthly',
    MODIFY `status` ENUM('active', 'cancel', 'finish') NOT NULL DEFAULT 'active';
