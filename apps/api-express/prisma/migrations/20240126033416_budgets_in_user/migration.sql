/*
  Warnings:

  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBudgets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userBudgetsId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "budgets" JSONB NOT NULL DEFAULT '[]';

-- DropTable
DROP TABLE "Budget";

-- DropTable
DROP TABLE "UserBudgets";
