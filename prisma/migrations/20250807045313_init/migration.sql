-- AlterTable
ALTER TABLE `kos` ADD COLUMN `fotoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `kos` ADD CONSTRAINT `kos_fotoId_fkey` FOREIGN KEY (`fotoId`) REFERENCES `foto`(`idFoto`) ON DELETE SET NULL ON UPDATE CASCADE;
