/*
  Warnings:

  - You are about to drop the column `comment` on the `peerrating` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `peerrating` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `peerrating` table. All the data in the column will be lost.
  - You are about to drop the `aiscore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `aiscore` DROP FOREIGN KEY `AIScore_userId_fkey`;

-- AlterTable
ALTER TABLE `peerrating` DROP COLUMN `comment`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `rating`,
    ADD COLUMN `creativity` DOUBLE NULL,
    ADD COLUMN `skills` DOUBLE NULL,
    ADD COLUMN `workEthic` DOUBLE NULL;

-- DropTable
DROP TABLE `aiscore`;

-- CreateTable
CREATE TABLE `UserScore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `automatedWorkEthic` DOUBLE NULL,
    `automatedCreativity` DOUBLE NULL,
    `automatedSkills` DOUBLE NULL,
    `automatedOverall` DOUBLE NULL,
    `peerWorkEthic` DOUBLE NULL,
    `peerCreativity` DOUBLE NULL,
    `peerSkills` DOUBLE NULL,
    `peerOverall` DOUBLE NULL,
    `finalWorkEthic` DOUBLE NULL,
    `finalCreativity` DOUBLE NULL,
    `finalSkills` DOUBLE NULL,
    `finalOverall` DOUBLE NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserScore_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserScore` ADD CONSTRAINT `UserScore_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
