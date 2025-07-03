-- AlterTable
ALTER TABLE `aiscore` ADD COLUMN `profileRating` DOUBLE NULL,
    ADD COLUMN `resumeRating` DOUBLE NULL;

-- AlterTable
ALTER TABLE `profile` ADD COLUMN `profilePicUrl` VARCHAR(191) NULL,
    ADD COLUMN `resumeFile` LONGBLOB NULL,
    MODIFY `profilePic` LONGBLOB NULL;

-- CreateTable
CREATE TABLE `PeerRating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ratedUserId` INTEGER NOT NULL,
    `raterId` INTEGER NOT NULL,
    `projectId` INTEGER NULL,
    `rating` DOUBLE NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PeerRating_ratedUserId_raterId_projectId_key`(`ratedUserId`, `raterId`, `projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PeerRating` ADD CONSTRAINT `PeerRating_ratedUserId_fkey` FOREIGN KEY (`ratedUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeerRating` ADD CONSTRAINT `PeerRating_raterId_fkey` FOREIGN KEY (`raterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PeerRating` ADD CONSTRAINT `PeerRating_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
