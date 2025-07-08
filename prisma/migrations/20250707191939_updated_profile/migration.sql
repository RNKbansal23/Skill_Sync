/*
  Warnings:

  - Made the column `expertiseLevel` on table `projectrequiredrole` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `projectrequiredrole` MODIFY `expertiseLevel` VARCHAR(191) NOT NULL;
