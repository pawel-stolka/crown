-- CreateTable
CREATE TABLE "UserBudgets" (
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "maxAmount" DECIMAL(65,30),
    "userBudgetsId" TEXT NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBudgets_userId_key" ON "UserBudgets"("userId");

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userBudgetsId_fkey" FOREIGN KEY ("userBudgetsId") REFERENCES "UserBudgets"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
