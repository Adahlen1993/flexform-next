/*
  Warnings:

  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropTable
DROP TABLE "UserSettings";

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weightUnit" TEXT NOT NULL DEFAULT 'lbs',
    "defaultSets" INTEGER NOT NULL DEFAULT 3,
    "promptFrequency" INTEGER NOT NULL DEFAULT 1,
    "preferredSplit" TEXT,
    "enableWarmups" BOOLEAN NOT NULL DEFAULT true,
    "enableCooldowns" BOOLEAN NOT NULL DEFAULT true,
    "remindersOn" BOOLEAN NOT NULL DEFAULT false,
    "allowAISuggests" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ExerciseTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExcludedTag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "UserExcludedTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseTag_name_key" ON "ExerciseTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserExcludedTag_userId_tagId_key" ON "UserExcludedTag"("userId", "tagId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExcludedTag" ADD CONSTRAINT "UserExcludedTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExcludedTag" ADD CONSTRAINT "UserExcludedTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ExerciseTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
