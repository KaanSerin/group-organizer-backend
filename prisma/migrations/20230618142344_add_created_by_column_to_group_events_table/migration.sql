/*
  Warnings:

  - Added the required column `created_by` to the `group_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_events" ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "group_events" ADD CONSTRAINT "group_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
