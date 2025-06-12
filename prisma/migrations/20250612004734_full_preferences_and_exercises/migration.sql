/*
  Warnings:

  - You are about to drop the `UserExcludedTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserExcludedTag" DROP CONSTRAINT "UserExcludedTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserExcludedTag" DROP CONSTRAINT "UserExcludedTag_userId_fkey";

-- AlterTable
ALTER TABLE "WeightLog" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "UserExcludedTag";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseOnTag" (
    "exerciseId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ExerciseOnTag_pkey" PRIMARY KEY ("exerciseId","tagId")
);

-- CreateTable
CREATE TABLE "UserExcludedExercise" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "UserExcludedExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserExcludedExercise_userId_exerciseId_key" ON "UserExcludedExercise"("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "ExerciseOnTag" ADD CONSTRAINT "ExerciseOnTag_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseOnTag" ADD CONSTRAINT "ExerciseOnTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ExerciseTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExcludedExercise" ADD CONSTRAINT "UserExcludedExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExcludedExercise" ADD CONSTRAINT "UserExcludedExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
