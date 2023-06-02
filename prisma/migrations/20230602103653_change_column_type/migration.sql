/*
  Warnings:

  - Changed the type of `user_role` on the `user_groups` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_groups" DROP COLUMN "user_role",
ADD COLUMN     "user_role" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_user_role_fkey" FOREIGN KEY ("user_role") REFERENCES "group_role_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
