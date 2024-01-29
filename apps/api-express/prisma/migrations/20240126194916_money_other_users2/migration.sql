/*
  Warnings:

  - You are about to drop the column `otherUsers` on the `Money` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Money" DROP COLUMN "otherUsers";

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "otherUserIds" JSONB NOT NULL DEFAULT '[]';
