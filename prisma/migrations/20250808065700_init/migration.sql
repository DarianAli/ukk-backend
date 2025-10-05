/*
  Warnings:

  - You are about to drop the column `fotoId` on the `kos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `kos` DROP FOREIGN KEY `kos_fotoId_fkey`;

-- DropIndex
DROP INDEX `kos_fotoId_fkey` ON `kos`;

-- AlterTable
ALTER TABLE `fasilitas` ADD COLUMN `kosId` INTEGER NULL;

-- AlterTable
ALTER TABLE `foto` ADD COLUMN `kosId` INTEGER NULL;

-- AlterTable
ALTER TABLE `kos` DROP COLUMN `fotoId`;

-- AddForeignKey
ALTER TABLE `foto` ADD CONSTRAINT `foto_kosId_fkey` FOREIGN KEY (`kosId`) REFERENCES `kos`(`idKos`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fasilitas` ADD CONSTRAINT `fasilitas_kosId_fkey` FOREIGN KEY (`kosId`) REFERENCES `kos`(`idKos`) ON DELETE SET NULL ON UPDATE CASCADE;
