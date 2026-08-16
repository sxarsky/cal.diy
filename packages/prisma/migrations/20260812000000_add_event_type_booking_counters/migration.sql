-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "bookingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cancellationCount" INTEGER NOT NULL DEFAULT 0;
