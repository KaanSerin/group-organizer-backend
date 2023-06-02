/*
  Warnings:

  - Added the required column `event_date` to the `group_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_events" ADD COLUMN     "event_date" TIMESTAMP(3) NOT NULL;
