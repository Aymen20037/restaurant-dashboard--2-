/*
  Warnings:

  - Made the column `permissions` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `roles` MODIFY `permissions` JSON NOT NULL;
