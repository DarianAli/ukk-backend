/*
  Warnings:

  - You are about to drop the column `reviewsid` on the `kos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `kos` DROP FOREIGN KEY `kos_reviewsid_fkey`;

-- DropIndex
DROP INDEX `kos_reviewsid_fkey` ON `kos`;

-- AlterTable
ALTER TABLE `kos` DROP COLUMN `reviewsid`;

-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `kosId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_kosId_fkey` FOREIGN KEY (`kosId`) REFERENCES `kos`(`idKos`) ON DELETE SET NULL ON UPDATE CASCADE;
