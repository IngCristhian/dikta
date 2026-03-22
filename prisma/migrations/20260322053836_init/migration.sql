-- CreateEnum
CREATE TYPE "Quadrant" AS ENUM ('DO', 'PLAN', 'DELEGATE', 'ELIMINATE');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "quadrant" "Quadrant" NOT NULL,
    "aiConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aiReasoning" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
